/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const { handleAssignment } = require('../functions/assignTech');
const { getHeatmapData } = require('../functions/heatmapData');
const { getAlerts } = require('../functions/getAlerts');
const { handleStatusUpdate } = require('../functions/updateStatus');
// Import all exported functions/triggers from the notifications file
const { onIncidentChange, onAlertCreate } = require('../functions/notifications');

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// ... existing exports.createIncident ...

/**
 * HTTPS function to handle POST /api/assign
 */
exports.assignTech = functions.https.onRequest(handleAssignment);
/**
 * HTTPS function to handle GET /api/incidents
 * Supports filtering by status and limit.
 */
exports.getIncidents = functions.https.onRequest(async (req, res) => {
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
        const { status, limit } = req.query; // Get query parameters

        let incidentsRef = db.collection('incidents');

        // 1. Filtering by Status
        if (status) {
            // Ensure status is a valid filter (e.g., 'New', 'In Progress', 'Resolved')
            incidentsRef = incidentsRef.where('status', '==', status);
        }

        // Always order by creation time (newest first)
        incidentsRef = incidentsRef.orderBy('createdAt', 'desc');

        // 2. Limiting the Results
        if (limit && !isNaN(parseInt(limit))) {
            incidentsRef = incidentsRef.limit(parseInt(limit));
        } else {
             // Default limit for dashboard lists
             incidentsRef = incidentsRef.limit(50); 
        }

        // 3. Execute the Query
        const snapshot = await incidentsRef.get();

        // 4. Format the Data
        const incidentList = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                category: data.category,
                priority: data.priority,
                status: data.status,
                location: { // Convert GeoPoint back to standard object for JSON response
                    lat: data.location.latitude,
                    lng: data.location.longitude
                },
                createdAt: data.createdAt.toDate(), // Convert Firestore Timestamp to JS Date
                imageUrl: data.imageUrl || null,
                reporterUid: data.reporterUid,
                assignedTechId: data.assignedTechId || null
            };
        });

        // 5. Send Success Response
        return res.status(200).send({ 
            ok: true, 
            count: incidentList.length,
            incidents: incidentList 
        });

    } catch (error) {
        console.error("Error fetching incidents:", error);
        return res.status(500).send({ ok: false, message: 'Internal Server Error' });
    }
});
// ... existing exports.getIncidents ...

/**
 * HTTPS function to handle GET /api/heatmap
 */
exports.getHeatmapData = functions.https.onRequest(getHeatmapData);
// ... existing functions ...

/**
 * HTTPS function to handle GET /api/alerts
 */
exports.getAlerts = functions.https.onRequest(getAlerts);
// ... existing functions ...

/**
 * HTTPS function to handle POST /api/status
 */
exports.updateStatus = functions.https.onRequest(handleStatusUpdate);
// ... existing HTTPS function exports ...

// --- Firestore Triggers (Task 7) ---
exports.onIncidentChange = onIncidentChange;
exports.onAlertCreate = onAlertCreate;