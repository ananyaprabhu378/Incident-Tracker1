import { useEffect, useMemo, useState } from "react";
import useAuth from "../hooks/useauth.jsx";

const INCIDENT_STORAGE_KEY = "incidents_v1";
const NOTIF_KEY = "notifications_v1";

function loadIncidents() {
  try {
    const raw = localStorage.getItem(INCIDENT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveIncidents(list) {
  localStorage.setItem(INCIDENT_STORAGE_KEY, JSON.stringify(list));
}

function loadNotifications() {
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotifications(list) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(list));
}

function pushNotification(notification) {
  const all = loadNotifications();
  all.unshift(notification);
  saveNotifications(all);
}

// small helpers
function formatAge(createdAt) {
  if (!createdAt) return "-";
  const now = Date.now();
  const ts = new Date(createdAt).getTime();
  const diffMin = Math.max(0, Math.round((now - ts) / (1000 * 60)));
  if (diffMin < 60) return `${diffMin} min`;
  const hours = diffMin / 60;
  if (hours < 24) return `${hours.toFixed(1)} h`;
  const days = hours / 24;
  return `${days.toFixed(1)} d`;
}

function isSlaBreached(createdAt) {
  if (!createdAt) return false;
  const now = Date.now();
  const ts = new Date(createdAt).getTime();
  const diffMin = (now - ts) / (1000 * 60);
  return diffMin > 30;
}

function DashboardTechnician() {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [filterPriority, setFilterPriority] = useState("all");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [selectedIncident, setSelectedIncident] = useState(null);

  const technicianId = user?.email || "tech";

  useEffect(() => {
    setIncidents(loadIncidents());
  }, []);

  // recompute some scheduling stats
  const metrics = useMemo(() => {
    const assignedToMe = incidents.filter(
      (i) => i.assignedTo === technicianId && i.status !== "Resolved"
    );
    const inProgress = assignedToMe.filter((i) => i.status === "In Progress");
    const slaRisk = assignedToMe.filter((i) => isSlaBreached(i.createdAt));

    return {
      assignedCount: assignedToMe.length,
      inProgressCount: inProgress.length,
      slaRiskCount: slaRisk.length,
    };
  }, [incidents, technicianId]);

  // filter + sort list
  const visibleIncidents = useMemo(() => {
    let list = incidents.filter((i) => i.status !== "Resolved");
    if (filterPriority !== "all") {
      list = list.filter((i) => i.priority === filterPriority);
    }
    // sort: high priority first, then SLA-breached, then newest
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    return [...list].sort((a, b) => {
      const aSla = isSlaBreached(a.createdAt);
      const bSla = isSlaBreached(b.createdAt);
      if (aSla && !bSla) return -1;
      if (!aSla && bSla) return 1;
      const pa = priorityOrder[a.priority] ?? 3;
      const pb = priorityOrder[b.priority] ?? 3;
      if (pa !== pb) return pa - pb;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [incidents, filterPriority]);

  const updateIncidents = (updater, notificationBuilder) => {
    setError("");
    setInfo("");

    const current = loadIncidents(); // reload from storage
    const updated = updater(current);

    if (!updated) return; // updater already handled error

    saveIncidents(updated);
    setIncidents(updated);

    if (notificationBuilder) {
      const {
        reporterEmail,
        title,
        messageForReporter,
        messageForAdmin,
      } = notificationBuilder;

      const nowIso = new Date().toISOString();

      if (reporterEmail) {
        pushNotification({
          id: Date.now() + 1,
          targetRole: "reporter",
          targetEmail: reporterEmail,
          title,
          message: messageForReporter,
          createdAt: nowIso,
        });
      }

      pushNotification({
        id: Date.now() + 2,
        targetRole: "admin",
        targetEmail: null,
        title,
        message: messageForAdmin,
        createdAt: nowIso,
      });
    }
  };

  const handleAssignToMe = (incidentId) => {
    const inc = incidents.find((i) => i.id === incidentId);
    if (inc) {
      setSelectedIncident(inc);
    }

    updateIncidents(
      (current) => {
        const myOpenAssigned = current.filter(
          (i) => i.assignedTo === technicianId && i.status !== "Resolved"
        );
        if (myOpenAssigned.length >= 1) {
          setError(
            "You already have an assigned incident. Resolve or release it before taking a new one (no overlapping tasks)."
          );
          return null;
        }

        const idx = current.findIndex((i) => i.id === incidentId);
        if (idx === -1) return current;

        const incident = current[idx];

        if (incident.assignedTo && incident.assignedTo !== technicianId) {
          setError("This incident is already assigned to another technician.");
          return null;
        }

        const updatedIncident = {
          ...incident,
          assignedTo: technicianId,
          assignedName: user?.name || "Technician",
          assignedAt: new Date().toISOString(),
        };

        const copy = [...current];
        copy[idx] = updatedIncident;

        setInfo("Incident assigned to you. Full details shown above.");
        return copy;
      },
      () => {
        const incident = incidents.find((i) => i.id === incidentId);
        if (!incident) return {};
        const locationDisplay =
          incident.location ||
          [
            incident.hostel,
            incident.room ? `Room ${incident.room}` : null,
          ]
            .filter(Boolean)
            .join(" - ");
        const base = `${incident.category} issue in ${locationDisplay}`;
        return {
          reporterEmail: incident.reporterEmail,
          title: "Technician assigned",
          messageForReporter: `A technician has been assigned to your ${base}.`,
          messageForAdmin: `Technician ${user?.name || ""} took ownership of ${base}.`,
        };
      }
    );
  };

  const handleStartWork = (incidentId) => {
    const inc = incidents.find((i) => i.id === incidentId);
    if (inc) {
      setSelectedIncident(inc);
    }

    updateIncidents(
      (current) => {
        const inProgressMine = current.filter(
          (i) => i.assignedTo === technicianId && i.status === "In Progress"
        );
        if (inProgressMine.length >= 1) {
          setError(
            "You already have one task in progress. Finish it before starting another."
          );
          return null;
        }

        const idx = current.findIndex((i) => i.id === incidentId);
        if (idx === -1) return current;

        const incident = current[idx];

        if (incident.assignedTo !== technicianId) {
          setError("You can only start work on incidents assigned to you.");
          return null;
        }

        const updatedIncident = {
          ...incident,
          status: "In Progress",
          startedAt: new Date().toISOString(),
        };

        const copy = [...current];
        copy[idx] = updatedIncident;

        setInfo("Work started on incident. Full details shown above.");
        return copy;
      },
      () => {
        const incident = incidents.find((i) => i.id === incidentId);
        if (!incident) return {};
        const locationDisplay =
          incident.location ||
          [
            incident.hostel,
            incident.room ? `Room ${incident.room}` : null,
          ]
            .filter(Boolean)
            .join(" - ");
        const base = `${incident.category} issue in ${locationDisplay}`;
        return {
          reporterEmail: incident.reporterEmail,
          title: "Issue being worked on",
          messageForReporter: `A technician has started working on your ${base}.`,
          messageForAdmin: `Technician ${user?.name || ""} started ${base}.`,
        };
      }
    );
  };

  const handleResolve = (incidentId) => {
    const inc = incidents.find((i) => i.id === incidentId);
    if (inc) {
      setSelectedIncident(inc);
    }

    updateIncidents(
      (current) => {
        const idx = current.findIndex((i) => i.id === incidentId);
        if (idx === -1) return current;

        const incident = current[idx];

        if (incident.assignedTo !== technicianId) {
          setError("You can only resolve incidents assigned to you.");
          return null;
        }

        const updatedIncident = {
          ...incident,
          status: "Resolved",
          resolvedAt: new Date().toISOString(),
        };

        const copy = [...current];
        copy[idx] = updatedIncident;

        setInfo("Incident resolved. Full details shown above.");
        return copy;
      },
      () => {
        const incident = incidents.find((i) => i.id === incidentId);
        if (!incident) return {};
        const locationDisplay =
          incident.location ||
          [
            incident.hostel,
            incident.room ? `Room ${incident.room}` : null,
          ]
            .filter(Boolean)
            .join(" - ");
        const base = `${incident.category} issue in ${locationDisplay}`;
        return {
          reporterEmail: incident.reporterEmail,
          title: "Issue resolved",
          messageForReporter: `Your ${base} has been marked as resolved.`,
          messageForAdmin: `Technician ${user?.name || ""} resolved ${base}.`,
        };
      }
    );
  };

  const handleRelease = (incidentId) => {
    const inc = incidents.find((i) => i.id === incidentId);
    if (inc) {
      setSelectedIncident(inc);
    }

    updateIncidents(
      (current) => {
        const idx = current.findIndex((i) => i.id === incidentId);
        if (idx === -1) return current;

        const incident = current[idx];

        if (incident.assignedTo !== technicianId) {
          setError("You can only release incidents assigned to you.");
          return null;
        }

        const updatedIncident = {
          ...incident,
          assignedTo: null,
          assignedName: null,
          assignedAt: null,
          startedAt: null,
          status: "New",
        };

        const copy = [...current];
        copy[idx] = updatedIncident;

        setInfo("Assignment released. Incident is back in the pool.");
        return copy;
      },
      () => {
        const incident = incidents.find((i) => i.id === incidentId);
        if (!incident) return {};
        const locationDisplay =
          incident.location ||
          [
            incident.hostel,
            incident.room ? `Room ${incident.room}` : null,
          ]
            .filter(Boolean)
            .join(" - ");
        const base = `${incident.category} issue in ${locationDisplay}`;
        return {
          reporterEmail: incident.reporterEmail,
          title: "Technician reassigned",
          messageForReporter: `Your ${base} has been released and may be picked up by another technician.`,
          messageForAdmin: `Incident ${base} was released by ${
            user?.name || ""
          } and is unassigned again.`,
        };
      }
    );
  };

  const renderLocationDisplay = (i) => {
    if (i.location) return i.location;
    const parts = [];
    if (i.hostel) parts.push(i.hostel);
    if (i.room) parts.push(`Room ${i.room}`);
    return parts.join(" - ") || "Unknown location";
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {/* Header + workload summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1.2fr)",
          gap: 16,
        }}
      >
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: 4 }}>
            Technician workload
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
            Take ownership of incidents, avoid overlapping assignments, and keep
            admins and reporters updated as you work.
          </p>
        </div>

        <div
          style={{
            padding: "10px 12px",
            borderRadius: 14,
            background: "white",
            boxShadow: "0 10px 26px rgba(15,23,42,0.08)",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.85rem",
          }}
        >
          <div>
            <p style={{ color: "#6b7280" }}>Assigned to you</p>
            <p style={{ fontWeight: 600 }}>{metrics.assignedCount}</p>
          </div>
          <div>
            <p style={{ color: "#6b7280" }}>In progress</p>
            <p style={{ fontWeight: 600 }}>{metrics.inProgressCount}</p>
          </div>
          <div>
            <p style={{ color: "#6b7280" }}>SLA risks (&gt; 30 min)</p>
            <p
              style={{
                fontWeight: 600,
                color: metrics.slaRiskCount > 0 ? "#b91c1c" : "#16a34a",
              }}
            >
              {metrics.slaRiskCount}
            </p>
          </div>
        </div>
      </div>

      {/* Selected incident details panel */}
      {selectedIncident && (
        <div
          style={{
            padding: "14px 16px",
            borderRadius: 16,
            background: "white",
            boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
          }}
        >
          <p
            style={{
              fontSize: "0.8rem",
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "#6b7280",
              marginBottom: 6,
            }}
          >
            Selected incident details
          </p>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              marginBottom: 4,
              color: "#0f172a",
            }}
          >
            {selectedIncident.title}
          </h3>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#4b5563",
              marginBottom: 4,
            }}
          >
            {selectedIncident.category} ·{" "}
            {renderLocationDisplay(selectedIncident)}
          </p>
          <p
            style={{
              fontSize: "0.8rem",
              color: "#6b7280",
              marginBottom: 6,
            }}
          >
            Hostel: {selectedIncident.hostel || "—"} · Room:{" "}
            {selectedIncident.room || "—"}
          </p>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#111827",
              marginBottom: 6,
            }}
          >
            {selectedIncident.description}
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              fontSize: "0.8rem",
              color: "#6b7280",
            }}
          >
            <span>
              Priority: <strong>{selectedIncident.priority}</strong>
            </span>
            <span>
              Status: <strong>{selectedIncident.status}</strong>
            </span>
            <span>
              Created:{" "}
              {selectedIncident.createdAt
                ? new Date(selectedIncident.createdAt).toLocaleString()
                : "—"}
            </span>
            <span>Age: {formatAge(selectedIncident.createdAt)}</span>
            {selectedIncident.latitude && selectedIncident.longitude && (
              <span>
                GPS:{" "}
                <a
                  href={`https://www.google.com/maps?q=${selectedIncident.latitude},${selectedIncident.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "underline", color: "#2563eb" }}
                >
                  {selectedIncident.latitude.toFixed(4)},{" "}
                  {selectedIncident.longitude.toFixed(4)}
                </a>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Filters + list */}
      <div
        style={{
          padding: "16px 18px",
          borderRadius: 16,
          background: "white",
          boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
            alignItems: "center",
          }}
        >
          <h3 style={{ fontSize: "1.05rem", fontWeight: 600 }}>
            Open incidents
          </h3>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
              Filter by priority:
            </span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              style={{
                fontSize: "0.8rem",
                padding: "4px 8px",
                borderRadius: 999,
                border: "1px solid #d1d5db",
                background: "#f9fafb",
              }}
            >
              <option value="all">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {error && (
          <div
            style={{
              marginBottom: 8,
              padding: "8px 10px",
              borderRadius: 8,
              background: "#fee2e2",
              color: "#b91c1c",
              fontSize: "0.85rem",
            }}
          >
            {error}
          </div>
        )}
        {info && (
          <div
            style={{
              marginBottom: 8,
              padding: "8px 10px",
              borderRadius: 8,
              background: "#e0f2fe",
              color: "#075985",
              fontSize: "0.85rem",
            }}
          >
            {info}
          </div>
        )}

        {visibleIncidents.length === 0 ? (
          <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
            No open incidents right now. Once reporters log issues, they’ll
            appear here ranked by priority, SLA risk and recency.
          </p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {visibleIncidents.map((i) => {
              const sla = isSlaBreached(i.createdAt);
              const ageLabel = formatAge(i.createdAt);
              const isMine = i.assignedTo === technicianId;

              let statusBadgeBg = "#e0f2fe";
              let statusBadgeColor = "#0369a1";
              if (i.status === "In Progress") {
                statusBadgeBg = "#fef3c7";
                statusBadgeColor = "#92400e";
              } else if (i.status === "Resolved") {
                statusBadgeBg = "#dcfce7";
                statusBadgeColor = "#166534";
              }

              const locationDisplay = renderLocationDisplay(i);

              return (
                <div
                  key={i.id}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    background: sla ? "#fef2f2" : "#f9fafb",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {i.title}
                    </div>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        padding: "2px 8px",
                        borderRadius: 999,
                        background:
                          i.priority === "High"
                            ? "#fee2e2"
                            : i.priority === "Medium"
                            ? "#fef3c7"
                            : "#dcfce7",
                        color:
                          i.priority === "High"
                            ? "#b91c1c"
                            : i.priority === "Medium"
                            ? "#92400e"
                            : "#166534",
                      }}
                    >
                      {i.priority} priority
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#4b5563",
                      marginBottom: 2,
                    }}
                  >
                    {i.category} · {locationDisplay}
                  </p>

                  {/* GPS info directly under location */}
                  {i.latitude && i.longitude && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#6b7280",
                        marginBottom: 4,
                      }}
                    >
                      GPS:{" "}
                      <a
                        href={`https://www.google.com/maps?q=${i.latitude},${i.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          textDecoration: "underline",
                          color: "#2563eb",
                        }}
                      >
                        {i.latitude.toFixed(4)}, {i.longitude.toFixed(4)}
                      </a>
                    </p>
                  )}

                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#6b7280",
                      marginBottom: 6,
                    }}
                  >
                    {i.description}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          padding: "2px 8px",
                          borderRadius: 999,
                          background: statusBadgeBg,
                          color: statusBadgeColor,
                        }}
                      >
                        {i.status}
                      </span>
                      {i.assignedTo && (
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: isMine ? "#16a34a" : "#6b7280",
                          }}
                        >
                          Assigned to{" "}
                          {isMine
                            ? "you"
                            : i.assignedName || i.assignedTo || "technician"}
                        </span>
                      )}
                      {sla && (
                        <span
                          style={{
                            fontSize: "0.75rem",
                            padding: "2px 8px",
                            borderRadius: 999,
                            background: "#fee2e2",
                            color: "#b91c1c",
                          }}
                        >
                          SLA &gt; 30 min
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#6b7280",
                        textAlign: "right",
                      }}
                    >
                      <div>Age: {ageLabel}</div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedIncident(i)}
                      style={{
                        fontSize: "0.8rem",
                        padding: "4px 9px",
                        borderRadius: 999,
                        border: "1px solid #93c5fd",
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        cursor: "pointer",
                      }}
                    >
                      View full details
                    </button>

                    {!i.assignedTo && (
                      <button
                        type="button"
                        onClick={() => handleAssignToMe(i.id)}
                        style={{
                          fontSize: "0.8rem",
                          padding: "5px 10px",
                          borderRadius: 999,
                          border: "1px solid #22c55e",
                          background: "#ecfdf5",
                          color: "#15803d",
                          cursor: "pointer",
                        }}
                      >
                        Assign to me
                      </button>
                    )}

                    {isMine && i.status === "New" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleStartWork(i.id)}
                          style={{
                            fontSize: "0.8rem",
                            padding: "5px 10px",
                            borderRadius: 999,
                            border: "1px solid #f97316",
                            background: "#fff7ed",
                            color: "#c2410c",
                            cursor: "pointer",
                          }}
                        >
                          Start work
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRelease(i.id)}
                          style={{
                            fontSize: "0.8rem",
                            padding: "5px 10px",
                            borderRadius: 999,
                            border: "1px solid #d1d5db",
                            background: "white",
                            color: "#4b5563",
                            cursor: "pointer",
                          }}
                        >
                          Release
                        </button>
                      </>
                    )}

                    {isMine && i.status === "In Progress" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleResolve(i.id)}
                          style={{
                            fontSize: "0.8rem",
                            padding: "5px 10px",
                            borderRadius: 999,
                            border: "1px solid #22c55e",
                            background: "#ecfdf5",
                            color: "#15803d",
                            cursor: "pointer",
                          }}
                        >
                          Resolve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRelease(i.id)}
                          style={{
                            fontSize: "0.8rem",
                            padding: "5px 10px",
                            borderRadius: 999,
                            border: "1px solid #d1d5db",
                            background: "white",
                            color: "#4b5563",
                            cursor: "pointer",
                          }}
                        >
                          Release
                        </button>
                      </>
                    )}

                    {!isMine && i.assignedTo && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#9ca3af",
                        }}
                      >
                        (Owned by another technician)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardTechnician;
