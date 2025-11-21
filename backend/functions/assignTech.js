const admin = require('firebase-admin');
const db = admin.firestore();

/**
 * Checks if a technician has any active assignments that overlap with a new task.
 * For MVP, we'll check if the technician is currently assigned to any 'In Progress' or 'New' task.
 * @param {string} techId - The ID of the technician.
 * @returns {object} { isAvailable: boolean, overlappingAssignmentId: string | null }
 */
async function checkTechAvailability(techId) {
    try {
        // Find incidents assigned to this tech that are NOT 'Resolved' or 'Closed'
        const snapshot = await db.collection('incidents')
            .where('assignedTechId', '==', techId)
            .where('status', 'in', ['New', 'In Progress']) // Treat these statuses as 'busy'
            .limit(1)
            .get();

        if (!snapshot.empty) {
            // Technician has an active or new assignment already
            return { 
                isAvailable: false, 
                overlappingAssignmentId: snapshot.docs[0].id 
            };
        }

        return { isAvailable: true, overlappingAssignmentId: null };

    } catch (error) {
        console.error("Error checking technician availability:", error);
        // Fail safe: If there's an error, assume available to prevent blocking
        return { isAvailable: true, overlappingAssignmentId: null }; 
    }
}


/**
 * HTTPS function logic to handle assigning a tech to an incident.
 * @param {object} req - Request object with body: { incidentId, techId }
 * @param {object} res - Response object
 */
async function handleAssignment(req, res) {
    // CORS and Method check logic (same as in index.js)
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

    const { incidentId, techId } = req.body;

    if (!incidentId || !techId) {
        return res.status(400).send({ ok: false, message: 'Missing incidentId or techId.' });
    }

    try {
        // 1. Check Technician Overlap (Availability)
        const availability = await checkTechAvailability(techId);

        if (!availability.isAvailable) {
            // Constraint: No technician gets overlapping assignments 
            return res.status(409).send({ 
                ok: false, 
                message: `Technician ${techId} is currently busy with incident ${availability.overlappingAssignmentId}.`,
                overlappingId: availability.overlappingAssignmentId 
            });
        }

        // 2. Update the Incident document
        const incidentRef = db.collection('incidents').doc(incidentId);

        // Update assignment details and status
        await incidentRef.update({
            assignedTechId: techId,
            status: 'In Progress', // Change status upon assignment
            assignedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // 3. Success Response
        return res.status(200).send({ 
            ok: true, 
            assignmentId: incidentId, // The assignment ID is the incident ID
            message: `Incident ${incidentId} successfully assigned to ${techId}.`
        });

    } catch (error) {
        console.error("Error during assignment:", error);
        return res.status(500).send({ ok: false, message: 'Internal Server Error' });
    }
}

module.exports = {
    handleAssignment,
    checkTechAvailability // Export for testing
};