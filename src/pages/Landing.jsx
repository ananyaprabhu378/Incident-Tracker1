import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing-root">
      {/* Local styles just for this page */}
      <style>{`
        .landing-root {
          position: relative;
          min-height: calc(100vh - 64px);
          /* space for header */
          margin-top: 12px;
          overflow: hidden;
          color: #e5e7eb;
          font-family: -apple-system, BlinkMacSystemFont, system-ui, "Segoe UI",
            Roboto, Helvetica, Arial, sans-serif;
        }

        /* animated background */
        .landing-bg {
          position: absolute;
          inset: 0;
          z-index: -1;
          background:
            radial-gradient(circle at 0% 0%, #22c55e18, transparent 55%),
            radial-gradient(circle at 100% 0%, #0ea5e918, transparent 55%),
            radial-gradient(circle at 0% 100%, #f9731618, transparent 55%),
            radial-gradient(circle at 100% 100%, #6366f118, transparent 55%),
            #020617;
          overflow: hidden;
        }

        .landing-bg::before {
          content: "";
          position: absolute;
          width: 170%;
          height: 170%;
          left: -35%;
          top: -35%;
          background-image:
            radial-gradient(circle, #22c55e66 1px, transparent 1px),
            radial-gradient(circle, #0ea5e966 1px, transparent 1px),
            radial-gradient(circle, #f9731666 1px, transparent 1px);
          background-size: 80px 80px, 120px 120px, 150px 150px;
          background-position: 0 0, 40px 40px, 20px 60px;
          opacity: 0.5;
          animation: landingDots 30s linear infinite;
        }

        @keyframes landingDots {
          0% {
            transform: translate3d(-8%, -8%, 0) scale(1);
          }
          50% {
            transform: translate3d(8%, 5%, 0) scale(1.05);
          }
          100% {
            transform: translate3d(-8%, -8%, 0) scale(1);
          }
        }

        .landing-inner {
          max-width: 1120px;
          margin: 0 auto;
          padding: 12px 16px 32px;
        }

        .landing-grid {
          display: grid;
          grid-template-columns: minmax(0, 3fr) minmax(0, 2.2fr);
          gap: 22px;
          align-items: stretch;
        }

        @media (max-width: 900px) {
          .landing-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }

        .landing-glass {
          border-radius: 24px;
          padding: 22px 24px;
          background:
            radial-gradient(circle at top left, #22c55e33, transparent 55%),
            radial-gradient(circle at bottom right, #06b6d433, transparent 55%),
            rgba(15,23,42,0.96);
          border: 1px solid rgba(148,163,184,0.4);
          box-shadow:
            0 30px 80px rgba(15,23,42,0.95),
            0 0 0 1px rgba(15,23,42,0.9);
          backdrop-filter: blur(18px);
        }

        .landing-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 0.75rem;
          background: rgba(15,23,42,1);
          border: 1px solid rgba(34,197,94,0.6);
          color: #bbf7d0;
        }

        .landing-pill-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 12px #22c55e;
        }

        .landing-title {
          font-size: 2.3rem;
          line-height: 1.1;
          font-weight: 700;
          margin: 10px 0 8px;
          background: linear-gradient(to right, #22c55e, #06b6d4);
          -webkit-background-clip: text;
          color: transparent;
        }

        @media (max-width: 640px) {
          .landing-title {
            font-size: 2rem;
          }
        }

        .landing-sub {
          font-size: 0.95rem;
          color: #cbd5f5;
          max-width: 540px;
        }

        .landing-chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
          font-size: 0.78rem;
        }

        .landing-chip {
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid rgba(148,163,184,0.7);
          background: rgba(15,23,42,0.95);
          color: #e5e7eb;
        }

        .landing-cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 18px;
        }

        .landing-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 24px;
          border-radius: 999px;
          border: none;
          font-size: 0.95rem;
          font-weight: 600;
          text-decoration: none;
          background: linear-gradient(135deg, #22c55e, #4ade80);
          color: #022c22;
          box-shadow: 0 14px 40px rgba(34,197,94,0.6);
          cursor: pointer;
        }

        .landing-btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 9px 22px;
          border-radius: 999px;
          border: 1px solid rgba(148,163,184,0.7);
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          color: #e5e7eb;
          background: rgba(15,23,42,0.95);
          cursor: pointer;
        }

        .landing-small-caption {
          margin-top: 8px;
          font-size: 0.78rem;
          color: #9ca3af;
        }

        .landing-stat-card {
          border-radius: 20px;
          padding: 16px 18px;
          background:
            radial-gradient(circle at top, #4ade8033, transparent 60%),
            rgba(15,23,42,0.98);
          border: 1px solid rgba(148,163,184,0.45);
          box-shadow: 0 20px 55px rgba(15,23,42,0.95);
          display: grid;
          gap: 10px;
          font-size: 0.83rem;
        }

        .landing-stat-header {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: center;
        }

        .landing-stat-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 9px;
          border-radius: 999px;
          font-size: 0.7rem;
          background: rgba(15,23,42,0.95);
          border: 1px solid rgba(148,163,184,0.7);
        }

        .landing-stat-dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 10px #22c55e;
        }

        .landing-stat-row {
          display: flex;
          justify-content: space-between;
        }

        .landing-stat-label {
          color: #9ca3af;
        }

        .landing-section {
          margin-top: 32px;
        }

        .landing-section-title {
          font-size: 1.05rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: #e5e7eb;
        }

        .landing-section-sub {
          font-size: 0.86rem;
          color: #cbd5f5;
          max-width: 820px;
        }

        .landing-cols-3 {
          display: grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 16px;
          margin-top: 12px;
        }

        @media (max-width: 900px) {
          .landing-cols-3 {
            grid-template-columns: repeat(2, minmax(0,1fr));
          }
        }

        @media (max-width: 640px) {
          .landing-cols-3 {
            grid-template-columns: minmax(0,1fr);
          }
        }

        .landing-mini-card {
          background: rgba(15,23,42,0.97);
          border-radius: 16px;
          border: 1px solid rgba(55,65,81,0.95);
          padding: 12px 14px;
          font-size: 0.84rem;
          color: #d1d5db;
        }

        .landing-mini-card h4 {
          margin: 0 0 4px;
          font-size: 0.87rem;
          font-weight: 600;
          color: #e5e7eb;
        }

        .landing-mini-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 0.7rem;
          background: rgba(15,23,42,0.9);
          border: 1px solid rgba(148,163,184,0.9);
          margin-bottom: 4px;
        }

        .landing-mini-badge span {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #22c55e;
          margin-right: 4px;
        }
      `}</style>

      <div className="landing-bg" />

      <div className="landing-inner">
        {/* HERO GRID */}
        <section className="landing-grid">
          {/* Left: hero text */}
          <div className="landing-glass">
            <div className="landing-pill">
              <span className="landing-pill-dot" />
              Smart maintenance for hostels & campus utilities
            </div>

            <h1 className="landing-title">
              Track incidents in seconds.
              <br />
              Predict the next failure before it hits.
            </h1>

            <p className="landing-sub">
              Single place for students, admins and technicians to report
              issues, monitor campus health, and prevent repeated breakdowns.
              Our prediction engine learns from frequency, priority and ageing
              incidents to highlight the next high-risk spots.
            </p>

            <div className="landing-chip-row">
              <div className="landing-chip">👩‍🎓 Reporter – hostel students</div>
              <div className="landing-chip">🧑‍💼 Admin – campus ops team</div>
              <div className="landing-chip">🧰 Technician – maintenance crew</div>
            </div>

            <div className="landing-cta-row">
              <Link to="/register" className="landing-btn-primary">
                Get started – Register
              </Link>
              <Link to="/login" className="landing-btn-secondary">
                Login as Reporter / Admin / Technician
              </Link>
            </div>

            <div className="landing-small-caption">
              Risk is computed per <strong>hostel × problem category</strong>{" "}
              using: recent incident frequency, % of high-priority tickets,
              current open count, age of oldest open ticket and last-24-hour
              activity, passed through a logistic (sigmoid) function.
            </div>
          </div>

          {/* Right: stat / explanation card */}
          <div className="landing-stat-card">
            <div className="landing-stat-header">
              <div>
                <div
                  style={{
                    fontSize: "0.86rem",
                    fontWeight: 600,
                    color: "#f9fafb",
                  }}
                >
                  Today’s campus snapshot
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#9ca3af",
                    marginTop: 2,
                  }}
                >
                  All numbers are driven from the local incident data in this
                  prototype.
                </div>
              </div>
              <div className="landing-stat-badge">
                <span className="landing-stat-dot" />
                AI prediction active
              </div>
            </div>

            <div className="landing-stat-row">
              <span className="landing-stat-label">Incident logic</span>
              <span style={{ fontWeight: 600 }}>
                Unique hostel+room, duplicate prevention
              </span>
            </div>
            <div className="landing-stat-row">
              <span className="landing-stat-label">Prediction</span>
              <span style={{ fontWeight: 600 }}>
                Risk per hostel × category (0–100%)
              </span>
            </div>
            <div className="landing-stat-row">
              <span className="landing-stat-label">Scheduling</span>
              <span style={{ fontWeight: 600 }}>
                No overlapping tasks per technician
              </span>
            </div>
            <div className="landing-stat-row">
              <span className="landing-stat-label">SLA & GPS</span>
              <span style={{ fontWeight: 600 }}>
                30-minute SLA alerts + GPS link for technicians
              </span>
            </div>

            <div
              style={{
                marginTop: 4,
                fontSize: "0.78rem",
                color: "#9ca3af",
              }}
            >
              Login as <strong>Admin</strong> to see: campus health score,
              hostel heatmap, incident trend over time, predicted risk list and
              SLA breach counts.
            </div>
          </div>
        </section>

        {/* WHAT WE SOLVE */}
        <section className="landing-section">
          <h3 className="landing-section-title">
            What this platform actually solves for the hackathon
          </h3>
          <p className="landing-section-sub">
            Instead of scattered WhatsApp complaints, we give a structured
            incident platform with prediction and technician scheduling that
            aligns with the problem statement: unique users, no spam, GPS,
            auto-priority and incident forecasting.
          </p>

          <div className="landing-cols-3">
            <div className="landing-mini-card">
              <h4>1. Smart complaint capture</h4>
              <p>
                Students log issues with <strong>hostel, room, category</strong>
                , description and optional GPS. Repeated complaints from the
                same hostel & room for the same category are linked together
                instead of spamming admins.
              </p>
            </div>

            <div className="landing-mini-card">
              <h4>2. Intelligent priority & SLA</h4>
              <p>
                Rules auto-mark unsafe electrical, water leakage and fire-risk
                issues as <strong>High</strong>. SLA logic flags incidents open
                for more than 30 minutes so they are surfaced on the admin
                dashboard.
              </p>
            </div>

            <div className="landing-mini-card">
              <h4>3. Prediction & hotspots</h4>
              <p>
                For every hostel × problem category we compute a score from
                frequency trends, open vs resolved ratio and recent activity,
                then convert it to a probability of the{" "}
                <em>next incident happening</em>.
              </p>
            </div>
          </div>
        </section>

        {/* ROLE FLOWS */}
        <section className="landing-section">
          <h3 className="landing-section-title">How each role uses it</h3>
          <div className="landing-cols-3">
            <div className="landing-mini-card">
              <div className="landing-mini-badge">
                <span /> Reporter
              </div>
              <h4>Student / Resident</h4>
              <ul style={{ margin: "6px 0 0 14px", padding: 0, fontSize: "0.8rem" }}>
                <li>Login as Reporter</li>
                <li>File incident with hostel, room, category & GPS</li>
                <li>See status updates and history of own complaints</li>
                <li>Prevents duplicate spam for the same issue</li>
              </ul>
            </div>

            <div className="landing-mini-card">
              <div className="landing-mini-badge">
                <span /> Admin
              </div>
              <h4>Admin / Warden</h4>
              <ul style={{ margin: "6px 0 0 14px", padding: 0, fontSize: "0.8rem" }}>
                <li>Sees live incident list with filters</li>
                <li>Views hostel risk heatmap & campus health score</li>
                <li>Assigns tasks to technicians while avoiding overload</li>
                <li>Gets alerts for SLA breaches and repeat hotspots</li>
              </ul>
            </div>

            <div className="landing-mini-card">
              <div className="landing-mini-badge">
                <span /> Technician
              </div>
              <h4>Maintenance team</h4>
              <ul style={{ margin: "6px 0 0 14px", padding: 0, fontSize: "0.8rem" }}>
                <li>Can only hold one active task at a time</li>
                <li>Gets full context: hostel, room, GPS, age & priority</li>
                <li>Updates status: New → In Progress → Resolved</li>
                <li>Helps admin see load per technician clearly</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Landing;
