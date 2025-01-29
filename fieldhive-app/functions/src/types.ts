import { Request } from 'express';

export interface User {
  email: string;
  role: 'admin' | 'technician' | 'client';
  name: string;
  createdAt: FirebaseFirestore.Timestamp;
}

export interface Equipment {
  id?: string;
  propertyId: string;
  type: string;
  serialNumber: string;
  location: {
    latitude: number;
    longitude: number;
    description: string;
  };
  inspectionFrequency: 'weekly' | 'monthly' | 'quarterly';
  lastInspectionDate?: FirebaseFirestore.Timestamp;
  lastInspectionStatus?: string;
  createdAt: FirebaseFirestore.Timestamp;
}

export interface Inspection {
  equipmentId: string;
  technicianId: string;
  workOrderId?: string;
  timestamp: FirebaseFirestore.Timestamp;
  status: string;
  notes: string;
  photos?: string[];
}

export interface WorkOrder {
  type: 'inspection' | 'maintenance' | 'repair';
  equipmentId: string;
  propertyId: string;
  assignedTechnicianId: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: FirebaseFirestore.Timestamp;
  description: string;
  inspectionResult?: string;
  notes?: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

export interface InspectionSchedule {
  equipmentId: string;
  propertyId: string;
  frequency: 'weekly' | 'monthly' | 'quarterly';
  lastInspection: FirebaseFirestore.Timestamp | null;
  nextInspection: Date;
  createdAt: FirebaseFirestore.Timestamp;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    role: string;
  };
}

export interface CreateUserData {
  email: string;
  password: string;
  role: 'admin' | 'technician' | 'client';
  name: string;
}
