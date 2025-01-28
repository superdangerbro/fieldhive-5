import { ConditionTypes } from './base';

// Helper function to evaluate a single condition
export function evaluateCondition(condition, value, formData = {}) {
  const fieldValue = value ?? formData[condition.field];

  switch (condition.type) {
    case ConditionTypes.EQUALS:
      return fieldValue === condition.value;

    case ConditionTypes.NOT_EQUALS:
      return fieldValue !== condition.value;

    case ConditionTypes.GREATER_THAN:
      return Number(fieldValue) > Number(condition.value);

    case ConditionTypes.LESS_THAN:
      return Number(fieldValue) < Number(condition.value);

    case ConditionTypes.CONTAINS:
      return String(fieldValue).includes(String(condition.value));

    case ConditionTypes.NOT_CONTAINS:
      return !String(fieldValue).includes(String(condition.value));

    case ConditionTypes.STARTS_WITH:
      return String(fieldValue).startsWith(String(condition.value));

    case ConditionTypes.ENDS_WITH:
      return String(fieldValue).endsWith(String(condition.value));

    case ConditionTypes.IS_EMPTY:
      return fieldValue === null || fieldValue === undefined || fieldValue === '';

    case ConditionTypes.IS_NOT_EMPTY:
      return fieldValue !== null && fieldValue !== undefined && fieldValue !== '';

    case ConditionTypes.MATCHES:
      try {
        const regex = new RegExp(condition.value);
        return regex.test(String(fieldValue));
      } catch (e) {
        console.error('Invalid regex pattern:', condition.value);
        return false;
      }

    default:
      console.warn('Unknown condition type:', condition.type);
      return true;
  }
}

// Helper function to evaluate multiple conditions
export function evaluateConditions(conditions, formData = {}) {
  if (!Array.isArray(conditions) || conditions.length === 0) {
    return true;
  }

  return conditions.every(condition => 
    evaluateCondition(condition, formData[condition.field], formData)
  );
}

// Helper function to create a condition
export function createCondition(field, type, value, action = 'show') {
  if (!Object.values(ConditionTypes).includes(type)) {
    throw new Error(`Invalid condition type: ${type}`);
  }

  return {
    field,
    type,
    value,
    action
  };
}

// Helper function to create common conditions
export const ConditionCreators = {
  equals: (field, value) => 
    createCondition(field, ConditionTypes.EQUALS, value),

  notEquals: (field, value) => 
    createCondition(field, ConditionTypes.NOT_EQUALS, value),

  greaterThan: (field, value) => 
    createCondition(field, ConditionTypes.GREATER_THAN, value),

  lessThan: (field, value) => 
    createCondition(field, ConditionTypes.LESS_THAN, value),

  contains: (field, value) => 
    createCondition(field, ConditionTypes.CONTAINS, value),

  notContains: (field, value) => 
    createCondition(field, ConditionTypes.NOT_CONTAINS, value),

  startsWith: (field, value) => 
    createCondition(field, ConditionTypes.STARTS_WITH, value),

  endsWith: (field, value) => 
    createCondition(field, ConditionTypes.ENDS_WITH, value),

  isEmpty: (field) => 
    createCondition(field, ConditionTypes.IS_EMPTY, true),

  isNotEmpty: (field) => 
    createCondition(field, ConditionTypes.IS_NOT_EMPTY, true),

  matches: (field, pattern) => 
    createCondition(field, ConditionTypes.MATCHES, pattern)
};

// Helper function to combine multiple conditions with AND logic
export function and(...conditions) {
  return conditions;
}

// Helper function to combine multiple conditions with OR logic
export function or(...conditions) {
  return {
    type: 'or',
    conditions
  };
}

// Helper function to negate a condition
export function not(condition) {
  switch (condition.type) {
    case ConditionTypes.EQUALS:
      return createCondition(condition.field, ConditionTypes.NOT_EQUALS, condition.value);
    case ConditionTypes.NOT_EQUALS:
      return createCondition(condition.field, ConditionTypes.EQUALS, condition.value);
    case ConditionTypes.GREATER_THAN:
      return createCondition(condition.field, ConditionTypes.LESS_THAN, condition.value);
    case ConditionTypes.LESS_THAN:
      return createCondition(condition.field, ConditionTypes.GREATER_THAN, condition.value);
    case ConditionTypes.CONTAINS:
      return createCondition(condition.field, ConditionTypes.NOT_CONTAINS, condition.value);
    case ConditionTypes.NOT_CONTAINS:
      return createCondition(condition.field, ConditionTypes.CONTAINS, condition.value);
    case ConditionTypes.IS_EMPTY:
      return createCondition(condition.field, ConditionTypes.IS_NOT_EMPTY, true);
    case ConditionTypes.IS_NOT_EMPTY:
      return createCondition(condition.field, ConditionTypes.IS_EMPTY, true);
    default:
      throw new Error(`Cannot negate condition type: ${condition.type}`);
  }
}

// Helper function to evaluate complex conditions (including AND/OR logic)
export function evaluateComplexConditions(conditions, formData = {}) {
  if (!conditions) return true;
  if (!Array.isArray(conditions)) {
    if (conditions.type === 'or') {
      return conditions.conditions.some(condition =>
        evaluateComplexConditions([condition], formData)
      );
    }
    return evaluateCondition(conditions, formData[conditions.field], formData);
  }

  return conditions.every(condition =>
    evaluateComplexConditions(condition, formData)
  );
}

// Helper function to get dependent fields from conditions
export function getDependentFields(conditions) {
  if (!conditions) return [];
  if (!Array.isArray(conditions)) {
    if (conditions.type === 'or') {
      return conditions.conditions.flatMap(getDependentFields);
    }
    return [conditions.field];
  }
  return conditions.flatMap(getDependentFields);
}

// Helper function to validate conditions
export function validateConditions(conditions) {
  const errors = [];

  function validateSingleCondition(condition) {
    if (!condition.field) {
      errors.push('Condition field is required');
    }
    if (!Object.values(ConditionTypes).includes(condition.type)) {
      errors.push(`Invalid condition type: ${condition.type}`);
    }
    if (condition.value === undefined) {
      errors.push('Condition value is required');
    }
  }

  function validateConditionArray(conditionArray) {
    if (!Array.isArray(conditionArray)) {
      if (conditionArray.type === 'or') {
        conditionArray.conditions.forEach(validateConditionArray);
      } else {
        validateSingleCondition(conditionArray);
      }
    } else {
      conditionArray.forEach(validateConditionArray);
    }
  }

  validateConditionArray(conditions);
  return errors;
}
