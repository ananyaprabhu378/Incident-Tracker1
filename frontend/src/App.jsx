import { Routes, Route, Link, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import DashboardReporter from "./pages/DashboardReporter.jsx";
import DashboardAdmin from "./pages/DashboardAdmin.jsx";
import DashboardTechnician from "./pages/DashboardTechnician.jsx";
import IncidentList from "./pages/IncidentList.jsx";
import Notifications from "./pages/Notifications.jsx";
import { useAuth } from "./Context/AuthContext.jsx";

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      {/* animated background shared by all pages */}
      <div className="app-bg" />

      {/* main content area */}
      <div className="app-content">
        {/* Header */}
        <header
          style={{
            padding: "10px 24px",
            background: "#111827",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 20,
            borderRadius: 18,
            marginTop: 12,
            marginBottom: 16,
            boxShadow: "0 18px 45px rgba(15,23,42,0.85)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                background: "linear-gradient(135deg, #2563eb, #22c55e)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
            >
              IT
            </div>
            <h1
  style={{
    fontSize: "1.45rem",
    fontWeight: 800,
    color: "#ffffff",                  // <- makes it solid white
    textShadow: "0 0 10px #22c55e,0 0 18px #22c55e,0 0 26px #22c55e"  // <- gives glow for clarity
  }}
>
  Smart Campus Incident Tracker
</h1>
          </div>

          <nav style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link
              to="/"
              style={{
                color: "#e5e7eb",
                fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              Home
            </Link>

            {!user && (
              <>
                <Link
                  to="/login"
                  style={{ color: "#e5e7eb", fontSize: "0.9rem" }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  style={{ color: "#e5e7eb", fontSize: "0.9rem" }}
                >
                  Register
                </Link>
              </>
            )}

            {user && (
              <>
                <Link
                  to="/notifications"
                  style={{ color: "#e5e7eb", fontSize: "0.85rem" }}
                >
                  🔔 Notifications
                </Link>
                <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                  {user.role?.toUpperCase()} · {user.name}
                </span>
                <button
                  onClick={logout}
                  style={{
                    fontSize: "0.8rem",
                    padding: "4px 10px",
                    borderRadius: 999,
                    border: "1px solid #4b5563",
                    background: "transparent",
                    color: "#e5e7eb",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </header>

        {/* Main Routes */}
        <main style={{ padding: "8px 8px 24px" }}>
          <Routes>
            {/* Landing page */}
            <Route path="/" element={<Landing />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Reporter routes */}
            <Route
              path="/reporter/dashboard"
              element={
                <ProtectedRoute allowedRoles={["reporter"]}>
                  <DashboardReporter />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reporter/incidents"
              element={
                <ProtectedRoute allowedRoles={["reporter"]}>
                  <IncidentList />
                </ProtectedRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <DashboardAdmin />
                </ProtectedRoute>
              }
            />

            {/* Technician */}
            <Route
              path="/technician/dashboard"
              element={
                <ProtectedRoute allowedRoles={["technician"]}>
                  <DashboardTechnician />
                </ProtectedRoute>
              }
            />

            {/* Notifications */}
            <Route
              path="/notifications"
              element={
                <ProtectedRoute
                  allowedRoles={["reporter", "admin", "technician"]}
                >
                  <Notifications />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
