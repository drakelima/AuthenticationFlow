import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};

export const signOutUser = () => {
  return signOut(auth);
};

export const onAuthStateChangedListener = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore user operations - using 'usuarios' collection to match Firestore rules
export const createUserDocumentFromAuth = async (userAuth: any, additionalInformation = {}) => {
  if (!userAuth) return;

  const userDocRef = doc(db, 'usuarios', userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log('Error creating user document:', error);
      throw error;
    }
  }

  return userDocRef;
};

export const updateUserDocument = async (uid: string, data: any) => {
  const userDocRef = doc(db, 'usuarios', uid);
  try {
    await updateDoc(userDocRef, {
      ...data,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.log('Error updating user document:', error);
    throw error;
  }
};

export const getUserDocument = async (uid: string) => {
  const userDocRef = doc(db, 'usuarios', uid);
  const userSnapshot = await getDoc(userDocRef);
  
  if (userSnapshot.exists()) {
    return { id: userSnapshot.id, ...userSnapshot.data() };
  }
  
  return null;
};

// Function to get user-friendly error messages in Portuguese
export const getFirebaseErrorMessage = (error: any): string => {
  const errorCode = error.code;
  
  switch (errorCode) {
    case 'auth/unauthorized-domain':
      return 'Domínio não autorizado. Verifique a configuração do Firebase.';
    case 'auth/popup-blocked':
      return 'Pop-up bloqueado. Permita pop-ups para este site.';
    case 'auth/popup-closed-by-user':
      return 'Login cancelado. Tente novamente.';
    case 'auth/network-request-failed':
      return 'Erro de conexão. Verifique sua internet.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.';
    case 'auth/user-disabled':
      return 'Conta desativada. Entre em contato com o suporte.';
    case 'auth/invalid-email':
      return 'E-mail inválido. Verifique o formato.';
    case 'auth/user-not-found':
      return 'Usuário não encontrado. Verifique seus dados.';
    case 'auth/wrong-password':
      return 'Senha incorreta. Tente novamente.';
    case 'auth/email-already-in-use':
      return 'E-mail já está em uso. Tente fazer login.';
    case 'auth/weak-password':
      return 'Senha muito fraca. Use pelo menos 6 caracteres.';
    case 'permission-denied':
      return 'Sem permissão para acessar os dados.';
    case 'unavailable':
      return 'Serviço temporariamente indisponível. Tente novamente.';
    default:
      return 'Erro inesperado. Tente novamente ou entre em contato com o suporte.';
  }
};