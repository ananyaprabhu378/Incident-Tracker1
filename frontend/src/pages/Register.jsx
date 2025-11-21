// src/pages/Register.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function Register(){
  const nav = useNavigate();
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [name, setName] = React.useState("");
  const [err, setErr] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (name) {
        await updateProfile(res.user, { displayName: name });
      }
      nav("/dashboard");
    } catch (error) {
      setErr(error.message);
      setBusy(false);
    }
  };

  return (
    <div className="page-center">
      <div className="card auth-card">
        <h2 className="h2">Create your account</h2>
        <p className="muted">Join the campus maintenance platform</p>

        <form onSubmit={handleSubmit} className="form">
          <label>Full name
            <input value={name} onChange={(e)=>setName(e.target.value)} type="text" placeholder="Ananya Prabhu" />
          </label>
          <label>Email
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required placeholder="you@example.com" />
          </label>
          <label>Password
            <input value={pass} onChange={(e)=>setPass(e.target.value)} type="password" required placeholder="At least 6 characters" />
          </label>

          {err && <div className="error">{err}</div>}

          <button className="btn btn-primary" disabled={busy} type="submit">
            {busy ? "Creating…" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
