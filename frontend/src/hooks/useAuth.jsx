// src/hooks/useAuth.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  async function register(email, password, displayName) {
    const resp = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(resp.user, { displayName });
    }
    return resp;
  }

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    return signOut(auth);
  }

  const value = { user, initializing, register, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
