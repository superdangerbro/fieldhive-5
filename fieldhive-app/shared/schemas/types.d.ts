declare module '../schemaManager' {
  interface SchemaManager {
    registerSchema(name: string, schema: any): void;
    createForm(name: string): Form;
    getRegisteredSchemas(): { [key: string]: any };
  }

  interface Form {
    validate(): ValidationResult;
  }

  interface ValidationResult {
    isValid: boolean;
    errors?: { [key: string]: string };
  }

  const manager: SchemaManager;
  export = {
    registerSchema: manager.registerSchema.bind(manager),
    createForm: manager.createForm.bind(manager),
    getRegisteredSchemas: manager.getRegisteredSchemas.bind(manager),
  };
}

declare module '../validation' {
  interface ValidationRules {
    getValidationRules(): { [key: string]: ValidationRule };
    createValidationRule(name: string, rule: ValidationRule): void;
  }

  interface ValidationRule {
    validate(value: any, context?: any): boolean;
    message: string;
  }

  const rules: ValidationRules;
  export = {
    getValidationRules: rules.getValidationRules.bind(rules),
    createValidationRule: rules.createValidationRule.bind(rules),
  };
}

declare module '../conditions' {
  interface Conditions {
    getConditions(): { [key: string]: Condition };
    createCondition(name: string, condition: Condition): void;
  }

  interface Condition {
    evaluate(context: any): boolean;
    description: string;
  }

  const conditions: Conditions;
  export = {
    getConditions: conditions.getConditions.bind(conditions),
    createCondition: conditions.createCondition.bind(conditions),
  };
}

declare module './equipmentInspection' {
  interface EquipmentInspectionSchema {
    name: string;
    version: string;
    fields: SchemaField[];
  }

  interface SchemaField {
    name: string;
    type: string;
    label: string;
    required?: boolean;
    validation?: string[];
    conditions?: string[];
  }

  const schema: EquipmentInspectionSchema;
  export = schema;
}

// Add global type augmentations
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

// Export an empty object to make this a module
export {};
