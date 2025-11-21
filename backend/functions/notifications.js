const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

// Define the UIDs that should receive Admin alerts
// In a real app, this would query a 'users' collection for 'role: admin'
const ADMIN_UIDS = ['admin123', 'anotherAdmin']; // Placeholder

/**
 * Helper function to write a notification to the database.
 */
async function writeNotification(targetUid, message, type, incidentId = null) {
    if (!targetUid || !message) return;

    return db.collection('notifications').add({
        targetUid, // Who the notification is for
        message,
        type, // e.g., 'new_incident', 'assignment', 'resolved'
        incidentId,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
}


/**
 * Firestore Trigger: Runs whenever an incident document is created or updated.
 */
exports.onIncidentChange = functions.firestore
    .document('incidents/{incidentId}')
    .onUpdate(async (change, context) => {
        const incidentId = context.params.incidentId;
        const before = change.before.data();
        const after = change.after.data();

        // --- 1. New Assignment Notification (Triggers when assignedTechId changes) ---
        if (after.assignedTechId && after.assignedTechId !== before.assignedTechId) {
            const techId = after.assignedTechId;
            const message = `Incident ${incidentId} (${after.title}) has been assigned to you.`;
            await writeNotification(techId, message, 'assignment', incidentId);

            // Also notify admin that assignment happened (optional)
            ADMIN_UIDS.forEach(uid => {
                writeNotification(uid, `Tech ${techId} assigned to Incident ${incidentId}.`, 'admin_assignment', incidentId);
            });
        }

        // --- 2. Issue Resolved Notification (Triggers when status changes to Resolved) ---
        if (after.status === 'Resolved' && before.status !== 'Resolved') {
            const reporterUid = after.reporterUid;
            const message = `Your incident ${incidentId} (${after.title}) has been successfully resolved.`;
            await writeNotification(reporterUid, message, 'resolved', incidentId);
        }

        // --- 3. SLA Escalation Notification (Not implemented here, but typically uses scheduled functions) ---
        // The team agreed SLA checks would be handled either by scheduled tasks (Person C) 
        // or an external service. For MVP, we skip the escalation trigger on update.

        return null; // Function completion
    });


/**
 * Firestore Trigger: Runs whenever Person C writes a new prediction alert.
 */
exports.onAlertCreate = functions.firestore
    .document('alerts/{alertId}')
    .onCreate(async (snapshot, context) => {
        const alert = snapshot.data();
        const message = `PREDICTION ALERT: ${alert.message}`;

        // Notify all administrators of a new prediction
        ADMIN_UIDS.forEach(uid => {
            writeNotification(uid, message, 'prediction_alert', null);
        });

        return null;
    });