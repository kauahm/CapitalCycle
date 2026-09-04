import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword,
  updateProfile, signInWithPopup, sendPasswordResetEmail, setPersistence,
  browserLocalPersistence, browserSessionPersistence,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const docRef = doc(db, 'usuarios', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const profile = docSnap.data();
            if (profile.situacao === 'inativa') {
              await signOut(auth);
              setCurrentUser(null);
              setUserProfile(null);
            } else {
              setUserProfile(profile);
            }
          }
        } catch (error) {
          console.error("Erro ao buscar perfil:", error);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // `remember` controla a persistência da sessão: marcado, a sessão
  // sobrevive ao fechamento do navegador (padrão do Firebase);
  // desmarcado, ela dura só enquanto a aba estiver aberta.
  const login = async (email, password, remember = true) => {
    await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
    const credencial = await signInWithEmailAndPassword(auth, email, password);

    // Conta desativada pelo painel de Usuários: o listener de sessão já
    // derruba o acesso, mas sem avisar nada. Aqui a recusa é explícita,
    // para a tela de login conseguir explicar o que aconteceu.
    const perfilSnap = await getDoc(doc(db, 'usuarios', credencial.user.uid));
    if (perfilSnap.exists() && perfilSnap.data().situacao === 'inativa') {
      await signOut(auth);
      const erro = new Error('Esta conta está desativada.');
      erro.code = 'auth/account-disabled';
      throw erro;
    }

    return credencial;
  };

  const logout = () => signOut(auth);

  // Envia o e-mail de redefinição de senha (link "Esqueceu a senha?").
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  // Login via Google — apenas para quem JÁ tem conta (perfil já existe em 'usuarios').
  // Se for a primeira vez desse uid, desfaz o login (signOut) e recusa: contas novas
  // só devem ser criadas pelo fluxo de cadastro (escolha de plano + pagamento).
  const loginWithGoogle = async () => {
    const { user } = await signInWithPopup(auth, googleProvider);

    const docRef = doc(db, 'usuarios', user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await signOut(auth);
      const erro = new Error('Nenhuma conta encontrada para esse Google. Escolha um plano para se cadastrar.');
      erro.code = 'auth/new-google-user';
      throw erro;
    }

    setUserProfile(docSnap.data());
    return user;
  };

  // Troca o plano de um usuário já autenticado (upgrade/downgrade), registrando
  // o comprovante de pagamento associado — usado pela tela de Pagamento quando
  // o fluxo é de troca de plano, e não de cadastro novo.
  const changePlanWithPayment = async ({ plan, payment }) => {
    if (!currentUser) throw new Error('Usuário não autenticado.');

    await setDoc(doc(db, 'usuarios', currentUser.uid), { plan }, { merge: true });

    if (payment) {
      await setDoc(doc(db, 'pagamentos', `${currentUser.uid}_${payment.idTransacao}`), {
        uid: currentUser.uid,
        plan,
        metodo: payment.metodo,
        valor: payment.valor,
        idTransacao: payment.idTransacao,
        status: 'aprovado',
        cartaoFinal: payment.cartaoFinal || null,
        createdAt: serverTimestamp(),
      });
    }

    setUserProfile((prev) => ({ ...(prev || {}), plan }));
  };

  // Cadastro tradicional: agora é invocado SOMENTE após a confirmação de pagamento.
  // O fluxo da tela de pagamento coleta os dados e, no sucesso, chama esta função.
  const registerWithPayment = async ({ name, email, password, plan, payment }) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: name });

    const profile = {
      nome: name,
      perfil: 'investidor',
      email,
      plan,
      // Sem este campo a conta nasce sem situação definida e o painel de
      // Usuários a exibe como inativa.
      situacao: 'ativa',
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'usuarios', user.uid), profile);

    // Registra o comprovante de pagamento vinculado ao uid do usuário.
    if (payment) {
      await setDoc(doc(db, 'pagamentos', `${user.uid}_${payment.idTransacao}`), {
        uid: user.uid,
        plan,
        metodo: payment.metodo, // 'pix' | 'cartao'
        valor: payment.valor,
        idTransacao: payment.idTransacao,
        status: 'aprovado',
        cartaoFinal: payment.cartaoFinal || null,
        createdAt: serverTimestamp(),
      });
    }

    setUserProfile(profile);
    return user;
  };

  // Cadastro via Google, mas SÓ após o pagamento confirmado.
  // O popup do Google é aberto dentro da tela de pagamento quando o usuário
  // escolhe pagar com Google + cartão/PIX.
  const registerWithPaymentGoogle = async ({ plan, payment }) => {
    const { user } = await signInWithPopup(auth, googleProvider);

    const docRef = doc(db, 'usuarios', user.uid);
    const docSnap = await getDoc(docRef);

    let profile;
    if (docSnap.exists()) {
      profile = docSnap.data();
      // A conta Google já existia: como o pagamento acabou de ser feito
      // para um plano específico, o plano precisa ser atualizado — senão
      // a pessoa paga por um plano e continua no antigo.
      if (plan && profile.plan !== plan) {
        await setDoc(docRef, { plan }, { merge: true });
        profile = { ...profile, plan };
      }
    } else {
      profile = {
        nome: user.displayName || 'Usuário',
        perfil: 'investidor',
        email: user.email,
        plan: plan || 'jovem',
        situacao: 'ativa',
        createdAt: serverTimestamp(),
      };
      await setDoc(docRef, profile);
    }

    if (payment) {
      await setDoc(doc(db, 'pagamentos', `${user.uid}_${payment.idTransacao}`), {
        uid: user.uid,
        plan,
        metodo: payment.metodo,
        valor: payment.valor,
        idTransacao: payment.idTransacao,
        status: 'aprovado',
        cartaoFinal: payment.cartaoFinal || null,
        createdAt: serverTimestamp(),
      });
    }

    setUserProfile(profile);
    return user;
  };

  // Atualiza campos simples do perfil (ex.: renda_mensal em Perfil.jsx),
  // gravando com merge no Firestore e refletindo local sem esperar o
  // próximo snapshot.
  const updateUserProfile = async (dados) => {
    if (!currentUser) throw new Error('Usuário não autenticado.');
    await setDoc(doc(db, 'usuarios', currentUser.uid), dados, { merge: true });
    setUserProfile((prev) => ({ ...(prev || {}), ...dados }));
  };

  const contextValue = {
    currentUser: currentUser,
    userProfile: userProfile,
    updateUserProfile: updateUserProfile,
    register: registerWithPayment,
    registerWithPayment: registerWithPayment,
    loginWithPaymentGoogle: registerWithPaymentGoogle,
    changePlanWithPayment: changePlanWithPayment,
    login: login,
    loginWithGoogle: loginWithGoogle,
    resetPassword: resetPassword,
    logout: logout,
    loading: loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};
