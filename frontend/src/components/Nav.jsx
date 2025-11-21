// src/components/Nav.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";

export default function Nav({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">Smart Maintenance</Link>
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <span className="nav-user">Hi, {user.email.split("@")[0]}</span>
            <button className="btn btn-ghost" onClick={() => navigate("/dashboard")}>Dashboard</button>
            <button className="btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="btn btn-ghost" to="/login">Login</Link>
            <Link className="btn" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
