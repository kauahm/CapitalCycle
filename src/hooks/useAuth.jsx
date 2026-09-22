import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword,
  updateProfile, signInWithPopup, sendPasswordResetEmail, setPersistence,
  browserLocalPersistence, browserSessionPersistence,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../services/firebase';

const AuthContext = createContext(null);

// Versão dos documentos legais vigente no cadastro. Registrada junto ao aceite
// para que se saiba qual texto a pessoa leu. Contas criadas antes desta versão
// simplesmente não têm o campo — a ausência é esperada e não é corrigida
// retroativamente.
const TERMOS_VERSAO = '1.0';

/* ==========================================================================
   Operacao critica x registro secundario

   O cadastro nao e uma operacao so: ele cria a conta no Firebase Auth,
   grava o perfil em `usuarios/{uid}`, ajusta o displayName e grava o
   comprovante em `pagamentos/{...}`. Antes, qualquer uma delas falhando
   derrubava o fluxo inteiro com "erro" — mas a conta do Auth JA TINHA
   sido criada, porque e a primeira. Na segunda tentativa vinha
   `auth/email-already-in-use` e a pessoa ficava presa: nao conseguia
   concluir nem recomecar.

   A classificacao, que e o que define o que pode derrubar o cadastro:

     CRITICO
       - conta no Firebase Auth
       - documento `usuarios/{uid}`
     Sem os dois a pessoa nao tem acesso: e o perfil que carrega plano,
     nome e situacao. Falha aqui e falha de verdade e precisa aparecer.

     SECUNDARIO
       - `updateProfile({ displayName })`
       - documento em `pagamentos/{...}`
     O displayName e conveniencia — o nome de exibicao vem do perfil. E o
     pagamento e SIMULADO: nao existe gateway, banco nem conciliacao por
     tras dele, entao o comprovante e registro interno. Perder o registro
     de um pagamento que nao moveu dinheiro nao justifica destruir um
     cadastro ja concluido.

   Falha secundaria fica no console e o fluxo segue. Isso nao e esconder
   erro: nada e engolido em silencio, e nenhuma falha de Auth e mascarada
   como sucesso.
   ========================================================================== */

/* Grava o comprovante do pagamento simulado. Secundario por contrato:
   nunca lanca. */
async function registrarPagamento(uid, plan, payment) {
  if (!payment) return;
  try {
    await setDoc(doc(db, 'pagamentos', `${uid}_${payment.idTransacao}`), {
      uid,
      plan,
      metodo: payment.metodo, // 'pix' | 'cartao'
      valor: payment.valor,
      idTransacao: payment.idTransacao,
      status: 'aprovado',
      cartaoFinal: payment.cartaoFinal || null,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error(
      '[Cadastro] Comprovante de pagamento nao registrado (falha secundaria, cadastro preservado):',
      err?.code || err?.message,
    );
  }
}

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

    // Critico: e a troca de plano em si, o que a pessoa pagou para obter.
    await setDoc(doc(db, 'usuarios', currentUser.uid), { plan }, { merge: true });

    // Secundario: o comprovante nao pode desfazer a troca ja gravada.
    await registrarPagamento(currentUser.uid, plan, payment);

    setUserProfile((prev) => ({ ...(prev || {}), plan }));
  };

  // Cadastro tradicional: agora é invocado SOMENTE após a confirmação de pagamento.
  // O fluxo da tela de pagamento coleta os dados e, no sucesso, chama esta função.
  const registerWithPayment = async ({ name, email, password, plan, payment }) => {
    /* Passo 1, critico: a conta do Auth.

       `auth/email-already-in-use` aqui tem duas leituras muito diferentes,
       e tratar as duas como erro era o que prendia a pessoa:

         (a) uma tentativa ANTERIOR deste mesmo fluxo criou a conta e
             falhou depois, num passo seguinte;
         (b) o e-mail e de outra pessoa, que ja tem conta.

       O login com a MESMA senha separa os dois casos. Se entrar, a conta e
       desta pessoa, foi criada agora por este fluxo, e o certo e continuar
       de onde parou em vez de recomecar. Se nao entrar, e o caso (b) e o
       erro original vale. */
    let user;
    try {
      ({ user } = await createUserWithEmailAndPassword(auth, email, password));
    } catch (err) {
      if (err?.code !== 'auth/email-already-in-use') throw err;

      try {
        ({ user } = await signInWithEmailAndPassword(auth, email, password));
        console.warn('[Cadastro] Conta ja existia e a senha confere: retomando cadastro parcial.');
      } catch {
        // Senha nao confere: e mesmo o e-mail de outra pessoa.
        throw err;
      }
    }

    // Secundario: o nome de exibicao do Auth. O nome que a interface mostra
    // vem do perfil, entao falhar aqui nao muda nada para a pessoa.
    try {
      await updateProfile(user, { displayName: name });
    } catch (err) {
      console.error('[Cadastro] displayName nao atualizado (falha secundaria):', err?.code || err?.message);
    }

    /* Passo 2, critico: o perfil.

       `merge: true` para o caso de retomada — se uma tentativa anterior ja
       gravou parte do documento, isto completa em vez de sobrescrever, e
       `createdAt` de uma conta que ja existia nao e reescrito. */
    const perfilRef = doc(db, 'usuarios', user.uid);
    const jaExiste = (await getDoc(perfilRef)).exists();

    const profile = {
      nome: name,
      perfil: 'investidor',
      email,
      plan,
      // Sem este campo a conta nasce sem situação definida e o painel de
      // Usuários a exibe como inativa.
      situacao: 'ativa',
      ...(jaExiste ? {} : { createdAt: serverTimestamp() }),
      termosAceitos: { versao: TERMOS_VERSAO, em: serverTimestamp() },
    };
    await setDoc(perfilRef, profile, { merge: true });

    // Secundario: comprovante do pagamento simulado.
    await registrarPagamento(user.uid, plan, payment);

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
      // Conta nova: é o único momento em que o aceite é registrado. O ramo
      // acima, de conta que já existia, não recebe o campo — quem entrou antes
      // não aceitou esta versão, e inventar isso seria registrar um
      // consentimento que nunca houve.
      profile = {
        nome: user.displayName || 'Usuário',
        perfil: 'investidor',
        email: user.email,
        plan: plan || 'jovem',
        situacao: 'ativa',
        createdAt: serverTimestamp(),
        termosAceitos: { versao: TERMOS_VERSAO, em: serverTimestamp() },
      };
      await setDoc(docRef, profile);
    }

    // Secundario: comprovante do pagamento simulado.
    await registrarPagamento(user.uid, plan, payment);

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
