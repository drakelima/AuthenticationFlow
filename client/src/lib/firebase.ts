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

// Firestore user operations
export const createUserDocumentFromAuth = async (userAuth: any, additionalInformation = {}) => {
  if (!userAuth) return;

  const userDocRef = doc(db, 'users', userAuth.uid);
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
    }
  }

  return userDocRef;
};

export const updateUserDocument = async (uid: string, data: any) => {
  const userDocRef = doc(db, 'users', uid);
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
  const userDocRef = doc(db, 'users', uid);
  const userSnapshot = await getDoc(userDocRef);
  
  if (userSnapshot.exists()) {
    return { id: userSnapshot.id, ...userSnapshot.data() };
  }
  
  return null;
};