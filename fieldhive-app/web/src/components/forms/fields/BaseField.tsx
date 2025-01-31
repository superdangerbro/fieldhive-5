import React from 'react';
import { Box, Typography } from '@mui/material';
import { FieldDefinition, FormField } from '@/types/forms';

export interface BaseFieldProps {
  field: FormField;
  fieldDef: FieldDefinition;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export const BaseField: React.FC<BaseFieldProps> = ({
  field,
  fieldDef,
  value,
  onChange,
  error,
  disabled,
  required,
  children
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        component="label"
        sx={{
          display: 'block',
          mb: 1,
          fontWeight: required ? 600 : 400,
          color: error ? 'error.main' : 'text.primary'
        }}
      >
        {fieldDef.name}
        {required && ' *'}
      </Typography>
      
      {children}
      
      {(fieldDef.description || error) && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 0.5,
            color: error ? 'error.main' : 'text.secondary'
          }}
        >
          {error || fieldDef.description}
        </Typography>
      )}
    </Box>
  );
};
