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

const INCIDENTS_COLLECTION = "incidents";

// 🔄 Real-time subscription to all incidents (shared across devices)
export function subscribeToIncidents(callback) {
  const q = query(
    collection(db, INCIDENTS_COLLECTION),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((d) => ({
      _docId: d.id, // Firestore document id (for updates)
      ...d.data(),
    }));
    callback(list);
  });
}

// ➕ Create new incident document
export async function createIncident(data) {
  const payload = {
    ...data,
    createdAt: data.createdAt || new Date().toISOString(),
  };
  await addDoc(collection(db, INCIDENTS_COLLECTION), payload);
}

// ✏️ Update existing incident by Firestore document id
export async function updateIncident(docId, partial) {
  const ref = doc(db, INCIDENTS_COLLECTION, docId);
  await updateDoc(ref, partial);
}
