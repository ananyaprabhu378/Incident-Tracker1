const admin = require('firebase-admin');
const db = admin.firestore();

/**
 * HTTPS function logic to handle updating the status of an incident.
 */
async function handleStatusUpdate(req, res) {
    // Handle CORS and Method check
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.status(204).send('');
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).send({ ok: false, message: 'Method Not Allowed' });
    }

    const { incidentId, newStatus } = req.body;

    if (!incidentId || !newStatus) {
        return res.status(400).send({ ok: false, message: 'Missing incidentId or newStatus.' });
    }

    // --- Important Note on Authorization ---
    // This function relies heavily on the **Firestore Security Rules** (Task 4)
    // to ensure that *only* the Assigned Technician or an Admin can perform the update.
    // We do not re-implement authentication/role checks here.

    try {
        const incidentRef = db.collection('incidents').doc(incidentId);
        const updateData = {
            status: newStatus,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        // If the status is being set to 'Resolved', also set the resolvedAt timestamp
        if (newStatus === 'Resolved') {
            updateData.resolvedAt = admin.firestore.FieldValue.serverTimestamp();
        }

        await incidentRef.update(updateData);

        // 2. Success Response
        return res.status(200).send({ 
            ok: true, 
            message: `Incident ${incidentId} status updated to ${newStatus}.`
        });

    } catch (error) {
        console.error("Error during status update:", error);
        // This error likely indicates that the user failed the Firestore Security Rules check (unauthorized)
        return res.status(403).send({ ok: false, message: 'Update failed. Check authorization and incident ID.' });
    }
}

module.exports = {
    handleStatusUpdate
};