import React, { useState, useEffect } from 'react';
import { evaluateRule, applyRuleActions } from '../../schemas/conditions';
import { validateField } from '../../schemas/validation';

// Platform-specific imports will be handled by the renderer components
const DynamicForm = ({
  schema,
  initialData = {},
  availableSchemas = [],
  onDataChange,
  onValidationChange,
  disabled = false,
  readOnly = false,
  renderer: Renderer // Platform-specific renderer (web/mobile)
}) => {
  const [formData, setFormData] = useState(initialData);
  const [formState, setFormState] = useState({
    visibility: {},   // Field visibility state
    required: {},     // Field required state
    errors: {},       // Field validation errors
    touched: {},      // Fields that have been interacted with
    isValid: true     // Overall form validity
  });

  // Initialize form state
  useEffect(() => {
    const initialState = {
      visibility: {},
      required: {},
      errors: {},
      touched: {},
      isValid: true
    };

    // Set initial visibility and required states from schema
    schema.fields.forEach(field => {
      initialState.visibility[field.name] = true;
      initialState.required[field.name] = field.required || false;
    });

    setFormState(initialState);
  }, [schema]);

  // Evaluate conditional rules whenever form data changes
  useEffect(() => {
    if (!schema.rules || schema.rules.length === 0) return;

    let newFormState = { ...formState };

    // Evaluate each rule
    schema.rules.forEach(rule => {
      if (!rule.enabled) return;

      const ruleApplies = evaluateRule(rule, formData, {
        // Get data from other schemas if needed
        // This would be implemented based on your needs
      });

      if (ruleApplies) {
        newFormState = applyRuleActions(rule, newFormState);
      }
    });

    setFormState(newFormState);
  }, [formData, schema.rules]);

  // Validate form data whenever it changes
  useEffect(() => {
    const errors = {};
    let isValid = true;

    schema.fields.forEach(field => {
      // Skip validation for hidden fields
      if (!formState.visibility[field.name]) return;

      const validationResult = validateField(formData[field.name], {
        ...field,
        required: formState.required[field.name]
      });

      if (!validationResult.valid) {
        errors[field.name] = validationResult.error;
        isValid = false;
      }
    });

    setFormState(prevState => ({
      ...prevState,
      errors,
      isValid
    }));

    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [formData, formState.visibility, formState.required]);

  // Handle field value changes
  const handleFieldChange = (fieldName, value) => {
    const newData = {
      ...formData,
      [fieldName]: value
    };

    setFormData(newData);

    if (onDataChange) {
      onDataChange(newData);
    }

    // Mark field as touched
    setFormState(prevState => ({
      ...prevState,
      touched: {
        ...prevState.touched,
        [fieldName]: true
      }
    }));
  };

  // Handle field blur events
  const handleFieldBlur = (fieldName) => {
    setFormState(prevState => ({
      ...prevState,
      touched: {
        ...prevState.touched,
        [fieldName]: true
      }
    }));
  };

  // Get visible fields
  const visibleFields = schema.fields.filter(
    field => formState.visibility[field.name]
  );

  // Prepare field props for the renderer
  const fields = visibleFields.map(field => ({
    ...field,
    value: formData[field.name],
    error: formState.touched[field.name] ? formState.errors[field.name] : null,
    required: formState.required[field.name],
    disabled: disabled,
    readOnly: readOnly,
    onChange: (value) => handleFieldChange(field.name, value),
    onBlur: () => handleFieldBlur(field.name)
  }));

  return (
    <Renderer
      schema={schema}
      fields={fields}
      formState={formState}
      disabled={disabled}
      readOnly={readOnly}
    />
  );
};

export default DynamicForm;
