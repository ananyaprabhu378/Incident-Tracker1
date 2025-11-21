// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
// Assuming the path is correct:
import { auth } from "./lib/firebase"; 
import { onAuthStateChanged } from "firebase/auth";
import Nav from "./components/Nav";

// Context for global user state
export const AuthContext = React.createContext(null);

export default function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // Auth state listener hook
  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Loading state (shows spinner)
  if (loading) {
    return (
      <div className="page-center">
        {/* Placeholder for a simple spinner */}
        <div className="text-xl font-semibold text-gray-500">Loading...</div>
      </div>
    );
  }

  // Main App Router with Auth Context Provider
  return (
    <AuthContext.Provider value={user}>
      <Nav user={user} />
      <Routes>
        {/* Root path: Redirects based on auth status */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        
        {/* Auth routes: Redirects away if logged in */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        
        {/* Protected route: Redirects to login if not logged in */}
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthContext.Provider>
  );
}