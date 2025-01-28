import SchemaManager from '../schemaManager';
import equipmentInspectionSchema from './equipmentInspection';
import { mockFormData } from '../../../jest/testUtils';
import { FieldTypes } from '../base';

describe('Equipment Inspection Schema', () => {
  beforeEach(() => {
    // Register the schema before each test
    SchemaManager.registerSchema('equipment-inspection', equipmentInspectionSchema);
  });

  describe('Schema Registration', () => {
    it('should successfully register the schema', () => {
      const schema = SchemaManager.getSchema('equipment-inspection');
      expect(schema).toBeDefined();
      expect(schema.name).toBe('equipment-inspection');
      expect(schema.sections).toBeInstanceOf(Array);
    });

    it('should throw error for invalid schema name', () => {
      expect(() => SchemaManager.getSchema('invalid-schema')).toThrow();
    });
  });

  describe('Form Creation', () => {
    it('should create a form instance with default values', () => {
      const form = SchemaManager.createForm('equipment-inspection');
      expect(form.schema).toBeDefined();
      expect(form.getData).toBeInstanceOf(Function);
      expect(form.validate).toBeInstanceOf(Function);
    });

    it('should create a form instance with initial data', () => {
      const form = SchemaManager.createForm('equipment-inspection', mockFormData);
      const data = form.getData();
      expect(data.barcode).toBe(mockFormData.equipment.barcode);
      expect(data.equipmentType).toBe(mockFormData.equipment.type);
    });
  });

  describe('Field Validation', () => {
    let form;

    beforeEach(() => {
      form = SchemaManager.createForm('equipment-inspection');
    });

    it('should validate required fields', () => {
      const { isValid, errors } = form.validate();
      expect(isValid).toBe(false);
      expect(errors.barcode).toBeDefined();
      expect(errors.equipmentType).toBeDefined();
    });

    it('should pass validation with valid data', () => {
      form.setFieldValue('barcode', 'TRAP-123');
      form.setFieldValue('equipmentType', 'Trap');
      form.setFieldValue('location', {
        latitude: 37.7749,
        longitude: -122.4194,
      });

      const { isValid, errors } = form.validate();
      expect(isValid).toBe(true);
      expect(errors).toEqual({});
    });

    it('should validate barcode format', () => {
      form.setFieldValue('barcode', 'invalid barcode');
      const field = form.getField('barcode');
      expect(field.error).toBeDefined();
    });

    it('should validate geolocation data', () => {
      form.setFieldValue('location', {
        latitude: 200, // Invalid latitude
        longitude: -122.4194,
      });
      const field = form.getField('location');
      expect(field.error).toBeDefined();
    });
  });

  describe('Conditional Fields', () => {
    let form;

    beforeEach(() => {
      form = SchemaManager.createForm('equipment-inspection');
    });

    it('should show damage description when condition is "Damaged"', () => {
      form.setFieldValue('condition', 'Damaged');
      const damageField = form.getField('damageDescription');
      expect(damageField.hidden).toBe(false);
    });

    it('should hide damage description when condition is not "Damaged"', () => {
      form.setFieldValue('condition', 'Good');
      const damageField = form.getField('damageDescription');
      expect(damageField.hidden).toBe(true);
    });

    it('should show activity type when activity is found', () => {
      form.setFieldValue('activityFound', true);
      const activityTypeField = form.getField('activityType');
      expect(activityTypeField.hidden).toBe(false);
    });

    it('should hide activity type when no activity is found', () => {
      form.setFieldValue('activityFound', false);
      const activityTypeField = form.getField('activityType');
      expect(activityTypeField.hidden).toBe(true);
    });
  });

  describe('Form Data Management', () => {
    let form;

    beforeEach(() => {
      form = SchemaManager.createForm('equipment-inspection');
    });

    it('should update field value', () => {
      form.setFieldValue('notes', 'Test notes');
      const field = form.getField('notes');
      expect(field.value).toBe('Test notes');
    });

    it('should track field touched state', () => {
      form.setFieldValue('notes', 'Test notes');
      const field = form.getField('notes');
      expect(field.touched).toBe(true);
    });

    it('should track field dirty state', () => {
      form.setFieldValue('notes', 'Test notes');
      const field = form.getField('notes');
      expect(field.dirty).toBe(true);
    });

    it('should reset form to initial state', () => {
      form.setFieldValue('notes', 'Test notes');
      form.reset();
      const field = form.getField('notes');
      expect(field.value).toBeNull();
      expect(field.touched).toBe(false);
      expect(field.dirty).toBe(false);
    });
  });

  describe('Field Types', () => {
    let form;

    beforeEach(() => {
      form = SchemaManager.createForm('equipment-inspection');
    });

    it('should handle string fields', () => {
      form.setFieldValue('notes', 'Test notes');
      const field = form.getField('notes');
      expect(field.type).toBe(FieldTypes.STRING);
      expect(field.value).toBe('Test notes');
    });

    it('should handle boolean fields', () => {
      form.setFieldValue('activityFound', true);
      const field = form.getField('activityFound');
      expect(field.type).toBe(FieldTypes.BOOLEAN);
      expect(field.value).toBe(true);
    });

    it('should handle enum fields', () => {
      form.setFieldValue('equipmentType', 'Trap');
      const field = form.getField('equipmentType');
      expect(field.type).toBe(FieldTypes.ENUM);
      expect(field.value).toBe('Trap');
      expect(field.options).toContain('Trap');
    });

    it('should handle geolocation fields', () => {
      const location = {
        latitude: 37.7749,
        longitude: -122.4194,
      };
      form.setFieldValue('location', location);
      const field = form.getField('location');
      expect(field.type).toBe(FieldTypes.GEOLOCATION);
      expect(field.value).toEqual(location);
    });
  });
});
