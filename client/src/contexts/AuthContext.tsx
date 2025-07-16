import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChangedListener, createUserDocumentFromAuth, getUserDocument } from '@/lib/firebase';

interface User {
  id: string;
  email: string;
  displayName: string;
  name?: string;
  phone?: string;
  createdAt: any;
  updatedAt?: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async (userAuth) => {
      if (userAuth) {
        // Create user document if it doesn't exist
        await createUserDocumentFromAuth(userAuth);
        
        // Get user document from Firestore
        const userDoc = await getUserDocument(userAuth.uid);
        
        if (userDoc) {
          setUser({
            id: userDoc.id,
            email: userDoc.email,
            displayName: userDoc.displayName,
            name: userDoc.name,
            phone: userDoc.phone,
            createdAt: userDoc.createdAt,
            updatedAt: userDoc.updatedAt,
          });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};