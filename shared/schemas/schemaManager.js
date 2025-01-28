import {
  FieldTypes,
  ValidationRules,
  ValidationMessages,
  BaseFieldSchema,
  BaseSectionSchema,
  BaseFormSchema,
  validateFieldSchema,
  validateFormSchema,
  getDefaultValueForType
} from './base';

class SchemaManager {
  constructor() {
    this.schemas = new Map();
    this.validators = new Map();
    this.formatters = new Map();
  }

  // Register a custom schema
  registerSchema(name, schema) {
    const errors = validateFormSchema(schema);
    if (errors.length > 0) {
      throw new Error(`Invalid schema: ${errors.join(', ')}`);
    }
    this.schemas.set(name, schema);
  }

  // Register a custom validator for a field type
  registerValidator(type, validator) {
    if (!Object.values(FieldTypes).includes(type)) {
      throw new Error(`Invalid field type: ${type}`);
    }
    this.validators.set(type, validator);
  }

  // Register a custom formatter for a field type
  registerFormatter(type, formatter) {
    if (!Object.values(FieldTypes).includes(type)) {
      throw new Error(`Invalid field type: ${type}`);
    }
    this.formatters.set(type, formatter);
  }

  // Get a schema by name
  getSchema(name) {
    const schema = this.schemas.get(name);
    if (!schema) {
      throw new Error(`Schema not found: ${name}`);
    }
    return schema;
  }

  // Create a new form instance from a schema
  createForm(schemaName, initialData = {}) {
    const schema = this.getSchema(schemaName);
    const form = {
      ...schema,
      sections: schema.sections.map(section => ({
        ...section,
        fields: section.fields.map(field => ({
          ...field,
          value: initialData[field.name] ?? field.defaultValue ?? getDefaultValueForType(field.type),
          error: null,
          touched: false,
          dirty: false
        }))
      }))
    };

    return {
      schema: form,
      getData: () => this.getFormData(form),
      validate: () => this.validateForm(form),
      getField: (name) => this.getField(form, name),
      setFieldValue: (name, value) => this.setFieldValue(form, name, value),
      reset: () => this.resetForm(form, initialData)
    };
  }

  // Get all field values as a flat object
  getFormData(form) {
    const data = {};
    form.sections.forEach(section => {
      section.fields.forEach(field => {
        if (!field.hidden && field.value !== null) {
          data[field.name] = field.value;
        }
      });
    });
    return data;
  }

  // Validate the entire form
  validateForm(form) {
    let isValid = true;
    const errors = {};

    form.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.hidden) return;

        const fieldErrors = this.validateField(field);
        if (fieldErrors.length > 0) {
          isValid = false;
          errors[field.name] = fieldErrors;
        }
      });
    });

    return { isValid, errors };
  }

  // Validate a single field
  validateField(field) {
    const errors = [];

    // Skip validation for hidden fields
    if (field.hidden) return errors;

    // Required field validation
    if (field.required && (field.value === null || field.value === '')) {
      errors.push(ValidationMessages[ValidationRules.REQUIRED]);
    }

    // Custom validator for field type
    const validator = this.validators.get(field.type);
    if (validator) {
      const customErrors = validator(field.value, field);
      if (customErrors) {
        errors.push(...customErrors);
      }
    }

    // Field-specific validation rules
    if (field.validation?.rules) {
      field.validation.rules.forEach(rule => {
        const error = this.validateRule(field.value, rule, field);
        if (error) {
          errors.push(
            field.validation.messages?.[rule.type] ||
            this.formatValidationMessage(error, rule)
          );
        }
      });
    }

    return errors;
  }

  // Validate a single rule
  validateRule(value, rule, field) {
    if (value === null || value === undefined) return null;

    switch (rule.type) {
      case ValidationRules.MIN:
        return value < rule.value ? ValidationMessages.MIN : null;
      case ValidationRules.MAX:
        return value > rule.value ? ValidationMessages.MAX : null;
      case ValidationRules.MIN_LENGTH:
        return String(value).length < rule.value ? ValidationMessages.MIN_LENGTH : null;
      case ValidationRules.MAX_LENGTH:
        return String(value).length > rule.value ? ValidationMessages.MAX_LENGTH : null;
      case ValidationRules.PATTERN:
        return !new RegExp(rule.value).test(String(value)) ? ValidationMessages.PATTERN : null;
      case ValidationRules.EMAIL:
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)) ? ValidationMessages.EMAIL : null;
      case ValidationRules.URL:
        try {
          new URL(String(value));
          return null;
        } catch {
          return ValidationMessages.URL;
        }
      case ValidationRules.CUSTOM:
        return rule.validate?.(value, field) || null;
      default:
        return null;
    }
  }

  // Format validation message with rule values
  formatValidationMessage(message, rule) {
    return message.replace(/\{(\w+)\}/g, (_, key) => rule[key]);
  }

  // Get a field by name
  getField(form, name) {
    for (const section of form.sections) {
      const field = section.fields.find(f => f.name === name);
      if (field) return field;
    }
    return null;
  }

  // Set a field value
  setFieldValue(form, name, value) {
    const field = this.getField(form, name);
    if (!field) return;

    field.value = value;
    field.touched = true;
    field.dirty = true;
    field.error = this.validateField(field);

    // Update dependent fields
    this.updateDependentFields(form, field);
  }

  // Update fields that depend on the changed field
  updateDependentFields(form, changedField) {
    form.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field === changedField) return;

        // Check field conditions
        if (field.conditions) {
          field.hidden = !this.evaluateConditions(field.conditions, form);
        }
      });

      // Check section conditions
      if (section.conditions) {
        section.hidden = !this.evaluateConditions(section.conditions, form);
      }
    });
  }

  // Evaluate field or section conditions
  evaluateConditions(conditions, form) {
    return conditions.every(condition => {
      const field = this.getField(form, condition.field);
      if (!field) return true;

      const value = field.value;
      switch (condition.type) {
        case 'equals':
          return value === condition.value;
        case 'notEquals':
          return value !== condition.value;
        case 'greaterThan':
          return value > condition.value;
        case 'lessThan':
          return value < condition.value;
        case 'contains':
          return String(value).includes(condition.value);
        case 'notContains':
          return !String(value).includes(condition.value);
        case 'startsWith':
          return String(value).startsWith(condition.value);
        case 'endsWith':
          return String(value).endsWith(condition.value);
        case 'isEmpty':
          return value === null || value === '' || value === undefined;
        case 'isNotEmpty':
          return value !== null && value !== '' && value !== undefined;
        case 'matches':
          return new RegExp(condition.value).test(String(value));
        default:
          return true;
      }
    });
  }

  // Reset form to initial state
  resetForm(form, initialData = {}) {
    form.sections.forEach(section => {
      section.fields.forEach(field => {
        field.value = initialData[field.name] ?? field.defaultValue ?? getDefaultValueForType(field.type);
        field.error = null;
        field.touched = false;
        field.dirty = false;
      });
      section.hidden = false;
    });
  }
}

export default new SchemaManager();
