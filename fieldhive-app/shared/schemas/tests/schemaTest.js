import SchemaManager from '../schemaManager';
import equipmentInspectionSchema from './equipmentInspection';
import { validateFormSchema } from '../base';
import { validateDocument } from '../firestore';
import { evaluateConditions } from '../conditions';

// Test data for equipment inspection
const testInspectionData = {
  barcode: 'TRAP-001',
  equipmentType: 'Trap',
  location: {
    latitude: 37.7749,
    longitude: -122.4194
  },
  condition: 'Damaged',
  damageDescription: 'Broken hinge on trap door',
  photo: {
    uri: 'file://photos/damage1.jpg',
    type: 'image/jpeg',
    name: 'damage1.jpg'
  },
  activityFound: true,
  activityType: 'Droppings',
  activityLevel: 'Medium',
  activityPhoto: {
    uri: 'file://photos/activity1.jpg',
    type: 'image/jpeg',
    name: 'activity1.jpg'
  },
  maintenanceNeeded: true,
  maintenanceType: 'Repair',
  priority: 'High',
  notes: 'Trap needs immediate repair to function properly',
  followUpNeeded: true,
  followUpDate: new Date('2025-02-01')
};

// Function to run schema tests
function runSchemaTests() {
  console.log('Running schema tests...\n');

  // Test 1: Validate schema structure
  console.log('Test 1: Validating schema structure');
  const schemaErrors = validateFormSchema(equipmentInspectionSchema);
  if (schemaErrors.length > 0) {
    console.error('Schema validation failed:', schemaErrors);
  } else {
    console.log('✓ Schema structure is valid');
  }
  console.log();

  // Test 2: Create form instance
  console.log('Test 2: Creating form instance');
  const form = SchemaManager.createForm('equipment-inspection');
  if (form) {
    console.log('✓ Form instance created successfully');
    console.log('Form sections:', form.schema.sections.length);
    console.log('Total fields:', form.schema.sections.reduce((total, section) => 
      total + section.fields.length, 0
    ));
  } else {
    console.error('Failed to create form instance');
  }
  console.log();

  // Test 3: Test field visibility conditions
  console.log('Test 3: Testing field visibility conditions');
  const testConditions = [
    {
      field: 'damageDescription',
      condition: { field: 'condition', type: 'equals', value: 'Damaged' },
      testValue: { condition: 'Damaged' },
      expectedVisibility: true
    },
    {
      field: 'activityType',
      condition: { field: 'activityFound', type: 'equals', value: true },
      testValue: { activityFound: false },
      expectedVisibility: false
    }
  ];

  testConditions.forEach(test => {
    const isVisible = evaluateConditions([test.condition], test.testValue);
    const passed = isVisible === test.expectedVisibility;
    console.log(
      `${passed ? '✓' : '✗'} Field '${test.field}' visibility:`,
      `expected ${test.expectedVisibility}, got ${isVisible}`
    );
  });
  console.log();

  // Test 4: Validate test data against schema
  console.log('Test 4: Validating test data');
  const form2 = SchemaManager.createForm('equipment-inspection', testInspectionData);
  const { isValid, errors } = form2.validate();
  if (isValid) {
    console.log('✓ Test data is valid');
  } else {
    console.error('Test data validation failed:', errors);
  }
  console.log();

  // Test 5: Test Firestore conversion
  console.log('Test 5: Testing Firestore data conversion');
  const firestoreData = {
    ...testInspectionData,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: 'test-inspection-1',
    organizationId: 'org-1'
  };

  const docErrors = validateDocument(firestoreData, equipmentInspectionSchema);
  if (docErrors.length === 0) {
    console.log('✓ Firestore document is valid');
  } else {
    console.error('Firestore document validation failed:', docErrors);
  }
  console.log();

  // Test 6: Test form data extraction
  console.log('Test 6: Testing form data extraction');
  const formData = form2.getData();
  const expectedFields = [
    'barcode',
    'equipmentType',
    'location',
    'condition',
    'activityFound',
    'maintenanceNeeded'
  ];

  const hasAllRequiredFields = expectedFields.every(field => field in formData);
  if (hasAllRequiredFields) {
    console.log('✓ Form data contains all required fields');
  } else {
    console.error('Missing required fields in form data');
  }
  console.log();

  // Summary
  console.log('Test Summary:');
  console.log('-------------');
  console.log('Total Sections:', equipmentInspectionSchema.sections.length);
  console.log('Total Fields:', equipmentInspectionSchema.sections.reduce((total, section) => 
    total + section.fields.length, 0
  ));
  console.log('Required Fields:', equipmentInspectionSchema.sections.reduce((total, section) => 
    total + section.fields.filter(f => f.required).length, 0
  ));
  console.log('Conditional Fields:', equipmentInspectionSchema.sections.reduce((total, section) => 
    total + section.fields.filter(f => f.conditions?.length > 0).length, 0
  ));
}

// Run the tests
try {
  runSchemaTests();
} catch (error) {
  console.error('Test execution failed:', error);
}

// Export test utilities
export const testUtils = {
  runSchemaTests,
  testInspectionData
};
