import { FieldTypes } from './base';

// Firestore collection names
export const Collections = {
  EQUIPMENT: 'equipment',
  INSPECTIONS: 'inspections',
  SCHEMAS: 'schemas',
  USERS: 'users',
  ORGANIZATIONS: 'organizations',
  LOCATIONS: 'locations',
  WORK_ORDERS: 'workOrders',
  ACTIVITY_LOGS: 'activityLogs'
};

// Firestore field types
export const FirestoreTypes = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  TIMESTAMP: 'timestamp',
  GEOPOINT: 'geopoint',
  REFERENCE: 'reference',
  ARRAY: 'array',
  MAP: 'map'
};

// Map app field types to Firestore types
export const FieldTypeMapping = {
  [FieldTypes.STRING]: FirestoreTypes.STRING,
  [FieldTypes.NUMBER]: FirestoreTypes.NUMBER,
  [FieldTypes.BOOLEAN]: FirestoreTypes.BOOLEAN,
  [FieldTypes.DATE]: FirestoreTypes.TIMESTAMP,
  [FieldTypes.TIMESTAMP]: FirestoreTypes.TIMESTAMP,
  [FieldTypes.ENUM]: FirestoreTypes.STRING,
  [FieldTypes.FILE]: FirestoreTypes.MAP,
  [FieldTypes.IMAGE]: FirestoreTypes.MAP,
  [FieldTypes.GEOLOCATION]: FirestoreTypes.GEOPOINT,
  [FieldTypes.BARCODE]: FirestoreTypes.STRING
};

// Base document schema
export const BaseDocument = {
  id: '',
  createdAt: null,
  createdBy: null,
  updatedAt: null,
  updatedBy: null,
  organizationId: null,
  isDeleted: false,
  metadata: {}
};

// Equipment document schema
export const EquipmentSchema = {
  ...BaseDocument,
  type: '',
  name: '',
  description: '',
  barcode: '',
  serialNumber: '',
  status: '',
  location: null, // GeoPoint
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  },
  properties: {}, // Dynamic properties based on equipment type
  lastInspection: null,
  nextInspectionDue: null,
  assignedTo: null, // User reference
  photos: [], // Array of photo URLs
  documents: [], // Array of document URLs
  tags: [] // Array of tags
};

// Inspection document schema
export const InspectionSchema = {
  ...BaseDocument,
  equipmentId: '', // Reference to equipment
  type: '',
  status: '',
  data: {}, // Dynamic inspection data
  photos: [],
  location: null, // GeoPoint
  completedAt: null,
  completedBy: null,
  notes: '',
  issues: [],
  followUpActions: []
};

// Work order document schema
export const WorkOrderSchema = {
  ...BaseDocument,
  type: '',
  status: '',
  priority: '',
  title: '',
  description: '',
  equipment: [], // Array of equipment references
  assignedTo: [], // Array of user references
  scheduledStart: null,
  scheduledEnd: null,
  actualStart: null,
  actualEnd: null,
  location: null, // GeoPoint
  photos: [],
  documents: [],
  notes: '',
  tasks: [],
  inspections: [] // Array of inspection references
};

// Activity log document schema
export const ActivityLogSchema = {
  ...BaseDocument,
  type: '',
  action: '',
  entityType: '',
  entityId: '',
  data: {},
  location: null, // GeoPoint
  deviceInfo: {
    type: '',
    os: '',
    browser: '',
    ip: ''
  }
};

// Helper function to convert app data to Firestore data
export function toFirestore(data, schema) {
  const firestoreData = {};

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined) return;

    const fieldSchema = schema[key];
    if (!fieldSchema) {
      firestoreData[key] = value;
      return;
    }

    const firestoreType = FieldTypeMapping[fieldSchema.type];
    switch (firestoreType) {
      case FirestoreTypes.TIMESTAMP:
        firestoreData[key] = value instanceof Date ? value : new Date(value);
        break;
      case FirestoreTypes.GEOPOINT:
        if (value && value.latitude && value.longitude) {
          firestoreData[key] = {
            latitude: value.latitude,
            longitude: value.longitude
          };
        }
        break;
      case FirestoreTypes.REFERENCE:
        firestoreData[key] = value; // Assume value is already a reference
        break;
      case FirestoreTypes.ARRAY:
        firestoreData[key] = Array.isArray(value) ? value : [];
        break;
      case FirestoreTypes.MAP:
        firestoreData[key] = typeof value === 'object' ? value : {};
        break;
      default:
        firestoreData[key] = value;
    }
  });

  return firestoreData;
}

// Helper function to convert Firestore data to app data
export function fromFirestore(data, schema) {
  const appData = {};

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined) return;

    const fieldSchema = schema[key];
    if (!fieldSchema) {
      appData[key] = value;
      return;
    }

    const firestoreType = FieldTypeMapping[fieldSchema.type];
    switch (firestoreType) {
      case FirestoreTypes.TIMESTAMP:
        appData[key] = value?.toDate?.() || value;
        break;
      case FirestoreTypes.GEOPOINT:
        if (value && value.latitude && value.longitude) {
          appData[key] = {
            latitude: value.latitude,
            longitude: value.longitude
          };
        }
        break;
      case FirestoreTypes.REFERENCE:
        appData[key] = value; // Keep as reference
        break;
      default:
        appData[key] = value;
    }
  });

  return appData;
}

// Helper function to create a new document
export function createDocument(data, schema) {
  const now = new Date();
  const doc = {
    ...BaseDocument,
    createdAt: now,
    updatedAt: now
  };

  return {
    ...doc,
    ...data
  };
}

// Helper function to update a document
export function updateDocument(doc, updates, schema) {
  return {
    ...doc,
    ...updates,
    updatedAt: new Date()
  };
}

// Helper function to validate document against schema
export function validateDocument(data, schema) {
  const errors = [];

  Object.entries(schema).forEach(([key, fieldSchema]) => {
    if (fieldSchema.required && !data[key]) {
      errors.push(`${key} is required`);
    }

    const value = data[key];
    if (value !== undefined && value !== null) {
      const firestoreType = FieldTypeMapping[fieldSchema.type];
      switch (firestoreType) {
        case FirestoreTypes.TIMESTAMP:
          if (!(value instanceof Date) && isNaN(new Date(value).getTime())) {
            errors.push(`${key} must be a valid date`);
          }
          break;
        case FirestoreTypes.GEOPOINT:
          if (!value.latitude || !value.longitude) {
            errors.push(`${key} must have latitude and longitude`);
          }
          break;
        case FirestoreTypes.ARRAY:
          if (!Array.isArray(value)) {
            errors.push(`${key} must be an array`);
          }
          break;
        case FirestoreTypes.MAP:
          if (typeof value !== 'object') {
            errors.push(`${key} must be an object`);
          }
          break;
      }
    }
  });

  return errors;
}
