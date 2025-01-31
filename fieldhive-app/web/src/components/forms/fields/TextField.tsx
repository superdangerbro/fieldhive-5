import React from 'react';
import { TextField as MuiTextField } from '@mui/material';
import { BaseField, BaseFieldProps } from './BaseField';

export const TextField: React.FC<BaseFieldProps> = (props) => {
  const { field, fieldDef, value, onChange, error, disabled, required } = props;

  return (
    <BaseField {...props}>
      <MuiTextField
        fullWidth
        size="small"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        error={!!error}
        disabled={disabled}
        required={required}
        placeholder={field.customPlaceholder || fieldDef.defaultPlaceholder}
      />
    </BaseField>
  );
};
