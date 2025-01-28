#!/usr/bin/env node
const admin = require('firebase-admin');
const path = require('path');

// Get service account key
const serviceAccount = require('../config/serviceAccountKey.json');

// Initialize Firebase Admin with credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'fieldhive-5-0',
});

const db = admin.firestore();

// Basic collections to create
const collections = [
  'users',           // User accounts and profiles
  'equipment',       // Individual equipment/devices
  'inspections',     // Inspection records
  'workOrders',      // Work order records
  'properties',      // Client properties/locations
  'schemas',         // Dynamic form schemas
  'reports'          // Generated reports
];

async function initializeDatabase() {
  try {
    console.log('🚀 Starting database initialization...');

    // Create empty collections
    for (const collection of collections) {
      console.log(`\n📝 Creating collection: ${collection}`);
      
      // Create a temporary document to ensure collection exists
      const tempDoc = db.collection(collection).doc('temp');
      await tempDoc.set({
        _created: admin.firestore.FieldValue.serverTimestamp(),
        _temp: true
      });
      
      // Delete the temporary document
      await tempDoc.delete();
      
      console.log(`✅ Created collection: ${collection}`);
    }

    console.log('\n✨ Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error initializing database:', error);
    process.exit(1);
  }
}

// Make script executable
if (require.main === module) {
  const scriptPath = __filename;
  try {
    require('fs').chmodSync(scriptPath, '755');
  } catch (error) {
    console.warn('Failed to make script executable:', error);
  }
  
  // Run initialization
  initializeDatabase().catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
}
