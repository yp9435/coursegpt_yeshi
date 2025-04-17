'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User,
  GoogleAuthProvider, 
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt?: any;
  lastLogin?: any;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provides authentication context and functionality for the application.
 * 
 * This context includes user authentication state, user data, and methods
 * for signing in with Google, signing out, and monitoring authentication state.
 * It also handles saving user data to Firestore.
 * 
 * @param {Object} props - The props for the AuthProvider component.
 * @param {ReactNode} props.children - The child components to be wrapped by the provider.
 * 
 * @returns {JSX.Element} The AuthContext.Provider component wrapping the children.
 * 
 * @context
 * - `user`: The currently authenticated Firebase user, or `null` if not authenticated.
 * - `userData`: Additional user data fetched from Firestore, or `null` if not available.
 * - `loading`: A boolean indicating whether authentication-related operations are in progress.
 * - `signInWithGoogle`: A function to sign in the user using Google authentication.
 * - `signOut`: A function to sign out the currently authenticated user.
 * 
 * @remarks
 * - The `saveUserToFirestore` function ensures user data is saved or updated in Firestore.
 * - The `signInWithGoogle` function uses Firebase's `signInWithPopup` method with a Google provider.
 * - The `signOut` function signs out the user and redirects to the home page.
 * - The `useEffect` hook monitors authentication state changes and updates the context accordingly.
 * 
 * @example
 * ```tsx
 * import { AuthProvider } from './contexts/AuthContext';
 * 
 * function App() {
 *   return (
 *     <AuthProvider>
 *       <YourAppComponents />
 *     </AuthProvider>
 *   );
 * }
 * ```
 */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Save user data to Firestore
  const saveUserToFirestore = async (user: User) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      // User exists, update lastLogin
      await setDoc(userRef, {
        lastLogin: serverTimestamp()
      }, { merge: true });
      
      // Get fresh user data
      const updatedSnap = await getDoc(userRef);
      setUserData(updatedSnap.data() as UserData);
    } else {
      // New user, create record
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      };
      
      await setDoc(userRef, userData);
      setUserData(userData);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        await saveUserToFirestore(result.user);
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          await saveUserToFirestore(user);
        } catch (error) {
          console.error('Error saving user data:', error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    userData,
    loading,
    signInWithGoogle,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};