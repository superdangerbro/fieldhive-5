import { https, firestore, EventContext, Change } from 'firebase-functions';
import { initializeApp } from 'firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import express from 'express';
import cors from 'cors';
import {
  User,
  Equipment,
  Inspection,
  WorkOrder,
  InspectionSchedule,
  AuthenticatedRequest,
  CreateUserData,
} from './types';

// Initialize Firebase Admin
initializeApp();

// Initialize Express app
const app = express();
app.use(cors({ origin: true }));

// Firestore references
const db = getFirestore();
const auth = getAuth();

// User Management Functions
export const createUser = https.onCall(
  async (data: CreateUserData, context: https.CallableContext) => {
    if (!context.auth?.token.admin) {
      throw new https.HttpsError(
        'permission-denied',
        'Only admins can create new users'
      );
    }

    const { email, password, role, name } = data;

    try {
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: name,
      });

      const userData: User = {
        email,
        role,
        name,
        createdAt: FieldValue.serverTimestamp() as FirebaseFirestore.Timestamp,
      };

      await db.collection('users').doc(userRecord.uid).set(userData);

      return { uid: userRecord.uid };
    } catch (error) {
      throw new https.HttpsError('internal', 'Error creating user');
    }
  }
);

// Equipment Management Functions
export const onEquipmentCreate = firestore
  .document('equipment/{equipmentId}')
  .onCreate(async (snap: firestore.QueryDocumentSnapshot, context: EventContext) => {
    const equipment = snap.data() as Equipment;
    const equipmentId = context.params.equipmentId;

    try {
      const scheduleData: InspectionSchedule = {
        equipmentId,
        propertyId: equipment.propertyId,
        frequency: equipment.inspectionFrequency,
        lastInspection: null,
        nextInspection: new Date(),
        createdAt: FieldValue.serverTimestamp() as FirebaseFirestore.Timestamp,
      };

      await db.collection('inspectionSchedules').add(scheduleData);
    } catch (error) {
      console.error('Error creating inspection schedule:', error);
    }
  });

// Inspection Functions
export const onInspectionComplete = firestore
  .document('inspections/{inspectionId}')
  .onCreate(async (snap: firestore.QueryDocumentSnapshot, context: EventContext) => {
    const inspection = snap.data() as Inspection;
    const equipmentId = inspection.equipmentId;

    try {
      // Update equipment last inspection date
      await db.collection('equipment').doc(equipmentId).update({
        lastInspectionDate: inspection.timestamp,
        lastInspectionStatus: inspection.status,
      });

      // Update inspection schedule
      const scheduleQuery = await db
        .collection('inspectionSchedules')
        .where('equipmentId', '==', equipmentId)
        .limit(1)
        .get();

      if (!scheduleQuery.empty) {
        const schedule = scheduleQuery.docs[0];
        const scheduleData = schedule.data() as InspectionSchedule;

        // Calculate next inspection date based on frequency
        let nextDate = new Date(inspection.timestamp.toDate());
        switch (scheduleData.frequency) {
          case 'weekly':
            nextDate.setDate(nextDate.getDate() + 7);
            break;
          case 'monthly':
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
          case 'quarterly':
            nextDate.setMonth(nextDate.getMonth() + 3);
            break;
          default:
            nextDate.setMonth(nextDate.getMonth() + 1);
        }

        await schedule.ref.update({
          lastInspection: inspection.timestamp,
          nextInspection: nextDate,
        });
      }
    } catch (error) {
      console.error('Error updating after inspection:', error);
    }
  });

// Work Order Functions
export const onWorkOrderUpdate = firestore
  .document('workOrders/{workOrderId}')
  .onUpdate(async (change: Change<firestore.QueryDocumentSnapshot>, context: EventContext) => {
    const newData = change.after.data() as WorkOrder;
    const previousData = change.before.data() as WorkOrder;

    // If work order is marked as complete
    if (newData.status === 'completed' && previousData.status !== 'completed') {
      try {
        // Create an inspection record if this was an inspection work order
        if (newData.type === 'inspection') {
          const inspectionData: Inspection = {
            equipmentId: newData.equipmentId,
            technicianId: newData.assignedTechnicianId,
            workOrderId: context.params.workOrderId,
            timestamp: FieldValue.serverTimestamp() as FirebaseFirestore.Timestamp,
            status: newData.inspectionResult || 'completed',
            notes: newData.notes || '',
          };

          await db.collection('inspections').add(inspectionData);
        }

        // Notify relevant users (to be implemented)
      } catch (error) {
        console.error('Error processing completed work order:', error);
      }
    }
  });

// API Endpoints
app.get('/api/equipment/:propertyId', async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const propertyId = req.params.propertyId;
    const snapshot = await db
      .collection('equipment')
      .where('propertyId', '==', propertyId)
      .get();

    const equipment = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Equipment[];

    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching equipment' });
  }
});

// Export the Express app as a Firebase Function
export const api = https.onRequest(app);
