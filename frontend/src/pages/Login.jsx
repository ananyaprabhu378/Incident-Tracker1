// src/pages/Login.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [err, setErr] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      nav("/dashboard");
    } catch (error) {
      setErr(error.message);
      setBusy(false);
    }
  };

  return (
    <div className="page-center">
      <div className="card auth-card">
        <h2 className="h2">Welcome back</h2>
        <p className="muted">Sign in to manage campus incidents</p>

        <form onSubmit={handleSubmit} className="form">
          <label>Email
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required placeholder="you@example.com" />
          </label>
          <label>Password
            <input value={pass} onChange={(e)=>setPass(e.target.value)} type="password" required placeholder="••••••" />
          </label>

          {err && <div className="error">{err}</div>}

          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="row-alt">
          <span>New here?</span>
          <Link to="/register" className="link">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
