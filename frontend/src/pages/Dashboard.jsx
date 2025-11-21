// src/pages/Dashboard.jsx
import React from "react";
import { auth } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Dashboard(){
  const user = auth.currentUser;
  const [summary, setSummary] = React.useState({open:0, closed:0, total:0});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // For demo: fake fetch - ideally query Firestore for incidents by user or counts
    async function load(){
      try {
        // example: count incidents if you had a collection
        // const q = query(collection(db, "incidents"), where("reporter_uid","==", user.uid));
        // const snap = await getDocs(q);
        // setSummary({ open: 3, closed: 1, total: snap.size });
        setSummary({ open: 2, closed: 1, total: 3 });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  return (
    <div className="page">
      <div className="container">
        <h1 className="title">Dashboard</h1>
        <p className="muted">Welcome {user?.displayName || user?.email}</p>

        <div className="grid">
          <div className="card stat">
            <h3>Open</h3>
            <div className="stat-num">{loading ? "…" : summary.open}</div>
            <p className="muted">Incidents open</p>
          </div>
          <div className="card stat">
            <h3>Closed</h3>
            <div className="stat-num">{loading ? "…" : summary.closed}</div>
            <p className="muted">Resolved incidents</p>
          </div>
          <div className="card stat">
            <h3>Total</h3>
            <div className="stat-num">{loading ? "…" : summary.total}</div>
            <p className="muted">Reports submitted</p>
          </div>
        </div>

        <div className="panel">
          <h2>Quick actions</h2>
          <div className="actions">
            <button className="btn">Create Report</button>
            <button className="btn btn-ghost">View Heatmap</button>
            <button className="btn btn-ghost">Technician panel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
