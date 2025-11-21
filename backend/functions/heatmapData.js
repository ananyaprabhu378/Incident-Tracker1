const admin = require('firebase-admin');
const db = admin.firestore();

/**
 * HTTPS function logic to handle fetching data for the heatmap.
 * @param {object} req - Request object with query: { from: YYYY-MM-DD, to: YYYY-MM-DD }
 * @param {object} res - Response object
 */
async function getHeatmapData(req, res) {
    // Handle CORS and Method check
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
        const { from, to } = req.query;
        let incidentsRef = db.collection('incidents');

        // --- 1. Time Range Filtering (Optional but highly recommended) ---
        if (from) {
            // Parse the 'from' date string (e.g., '2025-11-01')
            const startDate = new Date(from);
            // Set the start of the query to the beginning of the day (00:00:00)
            const startTimestamp = admin.firestore.Timestamp.fromDate(startDate);
            incidentsRef = incidentsRef.where('createdAt', '>=', startTimestamp);
        }

        if (to) {
            // Parse the 'to' date string
            const endDate = new Date(to);
            // Set the end of the query to the end of the day (23:59:59)
            endDate.setHours(23, 59, 59, 999); 
            const endTimestamp = admin.firestore.Timestamp.fromDate(endDate);
            incidentsRef = incidentsRef.where('createdAt', '<=', endTimestamp);
        }

        // Always order by createdAt for efficient querying (requires index in Firestore)
        incidentsRef = incidentsRef.orderBy('createdAt', 'asc'); 

        // --- 2. Execute the Query ---
        const snapshot = await incidentsRef.get();

        // --- 3. Format the Data (Returning raw points for client-side aggregation) ---
        const heatmapPoints = snapshot.docs.map(doc => {
            const data = doc.data();
            // We return just the location coordinates for the frontend heatmap library
            if (data.location && data.location.latitude && data.location.longitude) {
                 return {
                    lat: data.location.latitude,
                    lng: data.location.longitude
                    // Note: For advanced heatmaps, you might add a 'weight' here based on priority
                };
            }
            return null; // Skip incidents without valid location data
        }).filter(point => point !== null);


        // 4. Send Success Response
        // The API contract requires points to be returned: { "points":[ {"lat":..,"lng":..,"count":3}, ... ] }
        // Since we're returning raw points, the frontend library (react-leaflet-heatmap) usually aggregates the count.
        // For simplicity in the backend MVP, we return the list of raw points:
        return res.status(200).send({ 
            ok: true, 
            points: heatmapPoints 
        });

    } catch (error) {
        console.error("Error fetching heatmap data:", error);
        return res.status(500).send({ ok: false, message: 'Internal Server Error' });
    }
}

module.exports = {
    getHeatmapData
};