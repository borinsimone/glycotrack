import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext();

// Demo credentials for testing
const DEMO_CREDENTIALS = {
  email: 'demo@glycotrack.com',
  password: 'demo123',
};

const DEMO_USER = {
  uid: 'demo-user-123',
  email: 'demo@glycotrack.com',
  displayName: 'Demo User',
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('AuthProvider rendering...'); // Debug log

  const signup = (email, password) => {
    // Check if using demo credentials
    if (email === DEMO_CREDENTIALS.email) {
      return Promise.resolve({ user: DEMO_USER });
    }
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    // Check if using demo credentials
    if (
      email === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password
    ) {
      setCurrentUser(DEMO_USER);
      return Promise.resolve({ user: DEMO_USER });
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    // If demo user, just clear the state
    if (currentUser?.uid === 'demo-user-123') {
      setCurrentUser(null);
      return Promise.resolve();
    }
    return signOut(auth);
  };

  useEffect(() => {
    console.log('AuthProvider useEffect running...'); // Debug log

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user); // Debug log
      setCurrentUser(user);
      setLoading(false);
    });

    // Set loading to false immediately if no Firebase config
    if (
      !auth.app.options.apiKey ||
      auth.app.options.apiKey === 'your-api-key'
    ) {
      console.log('No Firebase config, setting loading to false'); // Debug log
      setLoading(false);
    }

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
  };

  console.log('AuthProvider state:', { currentUser, loading }); // Debug log

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
