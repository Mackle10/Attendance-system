
import {
  createContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@services/firebase';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnapshot = await getDoc(userRef);

        const profile = userSnapshot.exists()
          ? userSnapshot.data()
          : {};

        const idToken = await firebaseUser.getIdToken();

        const currentUser = {
          id: firebaseUser.uid,
          name:
            profile.fullName ||
            profile.name ||
            firebaseUser.displayName ||
            firebaseUser.email?.split('@')[0] ||
            'User',
          email: firebaseUser.email,
          role: profile.role || 'employee',
          avatar: profile.avatar || null,
        };

        setUser(currentUser);
        setToken(idToken);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to load user profile:', error);
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const result = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return result.user;
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((previousUser) => {
      if (!previousUser) {
        return previousUser;
      }

      return {
        ...previousUser,
        ...updates,
      };
    });
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
