import { Timestamp } from 'firebase/firestore';

export interface Metadata {
  createdAt: Timestamp;
  createdBy: string;
  updatedAt: Timestamp;
  updatedBy: string;
}

export type FieldType = 
  | 'text'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'date'
  | 'barcode'
  | 'image'
  | 'slider'
  | 'updownSelect';

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldDefinition {
  id: string;
  name: string;
  type: FieldType;
  description: string;
  category: string;        // Top level category (e.g., "equipment")
  subcategoryId?: string;  // Optional reference to subcategory
  defaultOptions?: FieldOption[];
  defaultPlaceholder?: string;
  metadata: Metadata;
  usageStats: {
    forms: string[];       // IDs of forms using this field
    count: number;
  };
}

export interface FormField {
  id: string;
  fieldDefId: string;     // Reference to FieldDefinition
  order: number;
  required: boolean;
  visible: boolean;
  customOptions?: FieldOption[];
  customPlaceholder?: string;
  rules: FormRule[];
}

export type RuleOperator = 
  | 'equals' 
  | 'notEquals' 
  | 'contains' 
  | 'notContains'
  | 'lessThan' 
  | 'greaterThan'
  | 'isEmpty' 
  | 'isNotEmpty'
  | 'startsWith' 
  | 'endsWith'
  | 'matches';            // regex

export type RuleAction = 
  | 'show' 
  | 'hide'
  | 'enable' 
  | 'disable'
  | 'require' 
  | 'optional'
  | 'setValue' 
  | 'clearValue';

export interface RuleCondition {
  id: string;
  fieldId: string;
  operator: RuleOperator;
  value?: any;
  chainOperator?: 'AND' | 'OR';
  nextConditionId?: string;
}

export interface RuleEffect {
  id: string;
  action: RuleAction;
  targetFieldIds: string[];
  value?: any;            // For setValue action
}

export interface FormRule {
  id: string;
  name: string;
  description?: string;
  conditions: RuleCondition[];
  effects: RuleEffect[];
  metadata: Metadata;
}

export interface FormTemplate {
  id: string;
  categoryId: string;
  subcategoryId?: string;
  name: string;
  description: string;
  fields: FormField[];
  childForms?: {
    id: string;
    type: string;
    enabled: boolean;
  }[];
  metadata: Metadata;
}

export interface FormCategory {
  id: string;
  name: string;
  description: string;
  metadata: Metadata;
}

export interface FormSubCategory {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  metadata: Metadata;
}
