import { ValidationRules, ValidationMessages } from './base';

// Common validation patterns
export const ValidationPatterns = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  PHONE: /^\+?[\d\s-()]{10,}$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
  LATITUDE: /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/,
  LONGITUDE: /^-?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/,
  BARCODE: {
    CODE128: /^[A-Za-z0-9 -]+$/,
    CODE39: /^[A-Z0-9 $%*+\-./:]+$/,
    EAN13: /^\d{13}$/,
    EAN8: /^\d{8}$/,
  }
};

// Custom validation functions
export const Validators = {
  // String validators
  required: (value) => {
    if (value === null || value === undefined || value === '') {
      return ValidationMessages[ValidationRules.REQUIRED];
    }
    return null;
  },

  minLength: (value, min) => {
    if (value && String(value).length < min) {
      return ValidationMessages[ValidationRules.MIN_LENGTH].replace('{minLength}', min);
    }
    return null;
  },

  maxLength: (value, max) => {
    if (value && String(value).length > max) {
      return ValidationMessages[ValidationRules.MAX_LENGTH].replace('{maxLength}', max);
    }
    return null;
  },

  pattern: (value, pattern, message = ValidationMessages[ValidationRules.PATTERN]) => {
    if (value && !pattern.test(String(value))) {
      return message;
    }
    return null;
  },

  // Number validators
  min: (value, min) => {
    if (value !== null && value !== undefined && value < min) {
      return ValidationMessages[ValidationRules.MIN].replace('{min}', min);
    }
    return null;
  },

  max: (value, max) => {
    if (value !== null && value !== undefined && value > max) {
      return ValidationMessages[ValidationRules.MAX].replace('{max}', max);
    }
    return null;
  },

  // Date validators
  minDate: (value, minDate) => {
    if (value && new Date(value) < new Date(minDate)) {
      return `Date must be after ${new Date(minDate).toLocaleDateString()}`;
    }
    return null;
  },

  maxDate: (value, maxDate) => {
    if (value && new Date(value) > new Date(maxDate)) {
      return `Date must be before ${new Date(maxDate).toLocaleDateString()}`;
    }
    return null;
  },

  // File validators
  fileType: (file, allowedTypes) => {
    if (file && !allowedTypes.includes(file.type)) {
      return `File type must be one of: ${allowedTypes.join(', ')}`;
    }
    return null;
  },

  fileSize: (file, maxSize) => {
    if (file && file.size > maxSize) {
      return `File size must be less than ${formatFileSize(maxSize)}`;
    }
    return null;
  },

  // Geolocation validators
  coordinates: (value) => {
    if (!value || typeof value !== 'object') return 'Invalid coordinates';
    
    const { latitude, longitude } = value;
    
    if (!ValidationPatterns.LATITUDE.test(String(latitude))) {
      return 'Invalid latitude';
    }
    
    if (!ValidationPatterns.LONGITUDE.test(String(longitude))) {
      return 'Invalid longitude';
    }
    
    return null;
  },

  // Barcode validators
  barcode: (value, format) => {
    const pattern = ValidationPatterns.BARCODE[format];
    if (!pattern) return 'Unsupported barcode format';
    
    if (!pattern.test(String(value))) {
      return `Invalid ${format} barcode format`;
    }
    
    return null;
  },

  // Common field validators
  email: (value) => {
    if (value && !ValidationPatterns.EMAIL.test(String(value))) {
      return ValidationMessages[ValidationRules.EMAIL];
    }
    return null;
  },

  url: (value) => {
    if (value && !ValidationPatterns.URL.test(String(value))) {
      return ValidationMessages[ValidationRules.URL];
    }
    return null;
  },

  phone: (value) => {
    if (value && !ValidationPatterns.PHONE.test(String(value))) {
      return 'Invalid phone number';
    }
    return null;
  },

  zipCode: (value) => {
    if (value && !ValidationPatterns.ZIP_CODE.test(String(value))) {
      return 'Invalid ZIP code';
    }
    return null;
  }
};

// Helper function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper function to combine multiple validators
export function composeValidators(...validators) {
  return (value) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  };
}

// Helper function to create a validation rule
export function createValidationRule(type, value, message) {
  return {
    type,
    value,
    message
  };
}

// Helper function to validate a value against multiple rules
export function validateValue(value, rules) {
  for (const rule of rules) {
    const validator = Validators[rule.type];
    if (validator) {
      const error = validator(value, rule.value);
      if (error) {
        return rule.message || error;
      }
    }
  }
  return null;
}

// Helper function to create common validation rules
export const ValidationRuleCreators = {
  required: (message) => createValidationRule(ValidationRules.REQUIRED, true, message),
  min: (min, message) => createValidationRule(ValidationRules.MIN, min, message),
  max: (max, message) => createValidationRule(ValidationRules.MAX, max, message),
  minLength: (min, message) => createValidationRule(ValidationRules.MIN_LENGTH, min, message),
  maxLength: (max, message) => createValidationRule(ValidationRules.MAX_LENGTH, max, message),
  pattern: (pattern, message) => createValidationRule(ValidationRules.PATTERN, pattern, message),
  email: (message) => createValidationRule(ValidationRules.EMAIL, true, message),
  url: (message) => createValidationRule(ValidationRules.URL, true, message),
  custom: (validator, message) => createValidationRule(ValidationRules.CUSTOM, validator, message)
};
