import {
  RuleCondition,
  RuleEffect,
  FormRule,
  FormField,
  RuleOperator,
} from '@/types/forms';

export class RuleEngine {
  private rules: FormRule[];
  private fields: FormField[];
  
  constructor(rules: FormRule[], fields: FormField[]) {
    this.rules = rules;
    this.fields = fields;
  }

  // Main evaluation method
  evaluate(formValues: Record<string, any>): RuleEffect[] {
    const effects: RuleEffect[] = [];
    
    for (const rule of this.rules) {
      if (this.evaluateConditions(rule.conditions, formValues)) {
        effects.push(...rule.effects);
      }
    }
    
    return this.resolveConflictingEffects(effects);
  }

  // Evaluate a chain of conditions
  private evaluateConditions(
    conditions: RuleCondition[],
    values: Record<string, any>
  ): boolean {
    let result = true;
    let currentCondition = conditions[0];
    
    while (currentCondition) {
      const conditionResult = this.evaluateCondition(
        currentCondition,
        values
      );
      
      if (currentCondition.chainOperator === 'AND') {
        result = result && conditionResult;
      } else if (currentCondition.chainOperator === 'OR') {
        result = result || conditionResult;
      } else {
        result = conditionResult;
      }
      
      currentCondition = conditions.find(
        c => c.id === currentCondition.nextConditionId
      );
    }
    
    return result;
  }

  // Evaluate a single condition
  private evaluateCondition(
    condition: RuleCondition,
    values: Record<string, any>
  ): boolean {
    const fieldValue = values[condition.fieldId];
    const conditionValue = condition.value;

    switch (condition.operator) {
      case 'equals':
        return fieldValue === conditionValue;
      case 'notEquals':
        return fieldValue !== conditionValue;
      case 'contains':
        return String(fieldValue).includes(String(conditionValue));
      case 'notContains':
        return !String(fieldValue).includes(String(conditionValue));
      case 'lessThan':
        return Number(fieldValue) < Number(conditionValue);
      case 'greaterThan':
        return Number(fieldValue) > Number(conditionValue);
      case 'isEmpty':
        return !fieldValue || fieldValue.length === 0;
      case 'isNotEmpty':
        return fieldValue && fieldValue.length > 0;
      case 'startsWith':
        return String(fieldValue).startsWith(String(conditionValue));
      case 'endsWith':
        return String(fieldValue).endsWith(String(conditionValue));
      case 'matches':
        try {
          const regex = new RegExp(String(conditionValue));
          return regex.test(String(fieldValue));
        } catch {
          return false;
        }
      default:
        return false;
    }
  }

  // Resolve conflicts between effects
  private resolveConflictingEffects(effects: RuleEffect[]): RuleEffect[] {
    const resolvedEffects: Record<string, RuleEffect> = {};

    // Process effects in order, later effects override earlier ones
    for (const effect of effects) {
      for (const targetId of effect.targetFieldIds) {
        const key = `${targetId}-${effect.action}`;
        resolvedEffects[key] = effect;
      }
    }

    return Object.values(resolvedEffects);
  }

  // Helper method to get field by ID
  private getField(fieldId: string): FormField | undefined {
    return this.fields.find(f => f.id === fieldId);
  }

  // Helper method to validate operator for field type
  private isOperatorValidForField(operator: RuleOperator, field: FormField): boolean {
    const fieldDef = this.fields.find(f => f.id === field.fieldDefId);
    if (!fieldDef) return false;

    switch (fieldDef.type) {
      case 'number':
        return ['equals', 'notEquals', 'lessThan', 'greaterThan'].includes(operator);
      case 'text':
        return ['equals', 'notEquals', 'contains', 'notContains', 'startsWith', 'endsWith', 'matches'].includes(operator);
      case 'select':
      case 'multiselect':
        return ['equals', 'notEquals', 'contains', 'notContains'].includes(operator);
      case 'checkbox':
        return ['equals'].includes(operator);
      case 'date':
        return ['equals', 'notEquals', 'lessThan', 'greaterThan'].includes(operator);
      default:
        return false;
    }
  }
}
