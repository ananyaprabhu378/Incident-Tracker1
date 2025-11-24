// src/services/incidentsApi.js

// Decide API root based on where the app is running
const API_ROOT = (() => {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;

    // 🧪 Local development on your laptop
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:5000"; // your local Node backend
    }

    // 🌐 Deployed on GitHub Pages (username.github.io)
    if (host.endsWith("github.io")) {
      // your Render backend URL
      return "https://incident-tracker1.onrender.com";
    }
  }

  // Fallback (just in case) – use Render backend
  return "https://incident-tracker1.onrender.com";
})();

const API_BASE = `${API_ROOT}/api`;

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  return res.json();
}

// 🔹 Get all incidents
export async function fetchIncidents() {
  const res = await fetch(`${API_BASE}/incidents`);
  return handleResponse(res);
}

// 🔹 Create a new incident (Reporter)
export async function createIncident(data) {
  const res = await fetch(`${API_BASE}/incidents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// 🔹 Update an incident (Technician / Admin)
export async function updateIncident(id, updates) {
  const res = await fetch(`${API_BASE}/incidents/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return handleResponse(res);
}

// 🔹 Delete an incident (Admin)
export async function deleteIncident(id) {
  const res = await fetch(`${API_BASE}/incidents/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}
