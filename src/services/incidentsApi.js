// src/services/incidentsApi.js
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const incidentsCol = collection(db, "incidents");

// 🔄 Real-time subscription to all incidents
export function subscribeToIncidents(callback) {
  const q = query(incidentsCol, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    callback(data);
  });
}

// ➕ Create new incident
export async function createIncident(incident) {
  const now = new Date().toISOString();

  const payload = {
    ...incident,
    status: incident.status || "New",
    createdAt: incident.createdAt || now,
    updatedAt: now,
  };

  await addDoc(incidentsCol, payload);
}

// ✏️ Update incident (status, technician, etc.)
export async function updateIncident(id, partial) {
  const ref = doc(db, "incidents", id);
  await updateDoc(ref, {
    ...partial,
    updatedAt: new Date().toISOString(),
  });
}
