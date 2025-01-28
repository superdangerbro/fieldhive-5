// Field types supported by the dynamic form system
export const FieldTypes = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  DATE: 'date',
  TIMESTAMP: 'timestamp',
  ENUM: 'enum',
  FILE: 'file',
  IMAGE: 'image',
  GEOLOCATION: 'geolocation',
  BARCODE: 'barcode'
};

// Base validation rules
export const ValidationRules = {
  REQUIRED: 'required',
  MIN: 'min',
  MAX: 'max',
  MIN_LENGTH: 'minLength',
  MAX_LENGTH: 'maxLength',
  PATTERN: 'pattern',
  EMAIL: 'email',
  URL: 'url',
  CUSTOM: 'custom'
};

// Default validation messages
export const ValidationMessages = {
  [ValidationRules.REQUIRED]: 'This field is required',
  [ValidationRules.MIN]: 'Value must be at least {min}',
  [ValidationRules.MAX]: 'Value must be at most {max}',
  [ValidationRules.MIN_LENGTH]: 'Must be at least {minLength} characters',
  [ValidationRules.MAX_LENGTH]: 'Must be at most {maxLength} characters',
  [ValidationRules.PATTERN]: 'Invalid format',
  [ValidationRules.EMAIL]: 'Invalid email address',
  [ValidationRules.URL]: 'Invalid URL',
};

// Field condition types for dynamic form behavior
export const ConditionTypes = {
  EQUALS: 'equals',
  NOT_EQUALS: 'notEquals',
  GREATER_THAN: 'greaterThan',
  LESS_THAN: 'lessThan',
  CONTAINS: 'contains',
  NOT_CONTAINS: 'notContains',
  STARTS_WITH: 'startsWith',
  ENDS_WITH: 'endsWith',
  IS_EMPTY: 'isEmpty',
  IS_NOT_EMPTY: 'isNotEmpty',
  MATCHES: 'matches'
};

// Base schema for form fields
export const BaseFieldSchema = {
  name: '',
  type: FieldTypes.STRING,
  label: '',
  description: '',
  defaultValue: null,
  placeholder: '',
  required: false,
  readOnly: false,
  hidden: false,
  validation: {
    rules: [],
    messages: {}
  },
  conditions: [], // Array of conditions that control field visibility/behavior
  options: null, // For enum fields
  props: {}, // Additional field-specific properties
  metadata: {} // Custom metadata for the field
};

// Base schema for form sections
export const BaseSectionSchema = {
  name: '',
  title: '',
  description: '',
  fields: [], // Array of field schemas
  conditions: [], // Array of conditions that control section visibility
  metadata: {} // Custom metadata for the section
};

// Base schema for forms
export const BaseFormSchema = {
  name: '',
  title: '',
  description: '',
  version: '1.0.0',
  sections: [], // Array of section schemas
  metadata: {}, // Custom metadata for the form
  settings: {
    submitLabel: 'Submit',
    cancelLabel: 'Cancel',
    showProgressBar: true,
    allowSaveAsDraft: true,
    requireConfirmation: false,
    confirmationMessage: 'Are you sure you want to submit this form?'
  }
};

// Helper function to create a new field schema
export const createField = (type, name, label, options = {}) => ({
  ...BaseFieldSchema,
  type,
  name,
  label,
  ...options
});

// Helper function to create a new section schema
export const createSection = (name, title, fields = [], options = {}) => ({
  ...BaseSectionSchema,
  name,
  title,
  fields,
  ...options
});

// Helper function to create a new form schema
export const createForm = (name, title, sections = [], options = {}) => ({
  ...BaseFormSchema,
  name,
  title,
  sections,
  ...options
});

// Helper function to create a field condition
export const createCondition = (field, type, value, action = 'show') => ({
  field,
  type,
  value,
  action
});

// Helper function to validate a field schema
export const validateFieldSchema = (schema) => {
  const errors = [];

  if (!schema.name) {
    errors.push('Field name is required');
  }

  if (!Object.values(FieldTypes).includes(schema.type)) {
    errors.push(`Invalid field type: ${schema.type}`);
  }

  if (schema.type === FieldTypes.ENUM && !Array.isArray(schema.options)) {
    errors.push('Enum field requires options array');
  }

  if (schema.validation?.rules) {
    schema.validation.rules.forEach(rule => {
      if (!Object.values(ValidationRules).includes(rule.type)) {
        errors.push(`Invalid validation rule type: ${rule.type}`);
      }
    });
  }

  return errors;
};

// Helper function to validate a form schema
export const validateFormSchema = (schema) => {
  const errors = [];

  if (!schema.name) {
    errors.push('Form name is required');
  }

  if (!Array.isArray(schema.sections)) {
    errors.push('Form sections must be an array');
  }

  schema.sections.forEach((section, sectionIndex) => {
    if (!section.name) {
      errors.push(`Section ${sectionIndex} name is required`);
    }

    if (!Array.isArray(section.fields)) {
      errors.push(`Section ${section.name} fields must be an array`);
    }

    section.fields.forEach((field, fieldIndex) => {
      const fieldErrors = validateFieldSchema(field);
      fieldErrors.forEach(error => {
        errors.push(`Section ${section.name} Field ${fieldIndex}: ${error}`);
      });
    });
  });

  return errors;
};

// Helper function to get default value for a field type
export const getDefaultValueForType = (type) => {
  switch (type) {
    case FieldTypes.STRING:
      return '';
    case FieldTypes.NUMBER:
      return null;
    case FieldTypes.BOOLEAN:
      return false;
    case FieldTypes.DATE:
    case FieldTypes.TIMESTAMP:
      return null;
    case FieldTypes.ENUM:
      return null;
    case FieldTypes.FILE:
    case FieldTypes.IMAGE:
      return null;
    case FieldTypes.GEOLOCATION:
      return null;
    case FieldTypes.BARCODE:
      return null;
    default:
      return null;
  }
};

// Helper function to format field value for display
export const formatFieldValue = (value, type) => {
  if (value === null || value === undefined) return '';

  switch (type) {
    case FieldTypes.DATE:
      return value instanceof Date
        ? value.toLocaleDateString()
        : new Date(value).toLocaleDateString();
    case FieldTypes.TIMESTAMP:
      return value instanceof Date
        ? value.toLocaleString()
        : new Date(value).toLocaleString();
    case FieldTypes.BOOLEAN:
      return value ? 'Yes' : 'No';
    case FieldTypes.GEOLOCATION:
      return value.latitude && value.longitude
        ? `${value.latitude}, ${value.longitude}`
        : '';
    default:
      return String(value);
  }
};
