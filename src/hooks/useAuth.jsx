import React, { useState, useEffect, createContext, useContext } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  // Login/cadastro via Google. Se for a primeira vez desse usuário (uid novo),
  // cria o documento de perfil em 'usuarios'; se já existir, apenas autentica
  // sem sobrescrever dados que o usuário já tenha (plano, etc).
  const loginWithGoogle = async (plan) => {
    const { user } = await signInWithPopup(auth, googleProvider);

    const docRef = doc(db, 'usuarios', user.uid);
    const docSnap = await getDoc(docRef);

    let profile;
    if (docSnap.exists()) {
      profile = docSnap.data();
    } else {
      profile = {
        nome: user.displayName || 'Usuário',
        perfil: 'investidor',
        email: user.email,
        plan: plan || 'jovem',
        createdAt: new Date(),
      };
      await setDoc(docRef, profile);
    }

    setUserProfile(profile);
    return user;
  };

  const register = async (name, email, password, plan) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: name });
    await setDoc(doc(db, 'usuarios', user.uid), {
      nome: name,
      perfil: 'investidor',
      email,
      plan,
      createdAt: new Date(),
    });
  };

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, register, login, loginWithGoogle, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};