const admin = require('firebase-admin');
const db = admin.firestore();

/**
 * HTTPS function logic to handle fetching prediction alerts.
 */
async function getAlerts(req, res) {
    // Handle CORS and Method check (same boilerplate as before)
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.status(204).send('');
        return;
    }
    if (req.method !== 'GET') {
        return res.status(405).send({ ok: false, message: 'Method Not Allowed' });
    }

    try {
        // 1. Query the 'alerts' collection
        const snapshot = await db.collection('alerts')
            // Order by newest alert first
            .orderBy('created_at', 'desc')
            .limit(20) // Limit the number of alerts shown on the dashboard
            .get();

        // 2. Format the Data
        const alertsList = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                message: data.message,
                zone: data.zone,
                category: data.category,
                created_at: data.created_at.toDate(), // Convert Firestore Timestamp
                // Prediction logic might add a severity score or associated incident IDs
                associated_incidents: data.associated_incidents || [] 
            };
        });

        // 3. Send Success Response
        return res.status(200).send({ 
            ok: true, 
            alerts: alertsList 
        });

    } catch (error) {
        console.error("Error fetching alerts:", error);
        return res.status(500).send({ ok: false, message: 'Internal Server Error' });
    }
}

module.exports = {
    getAlerts
};