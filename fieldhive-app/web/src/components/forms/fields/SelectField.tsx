import React from 'react';
import { Select, MenuItem, FormControl } from '@mui/material';
import { BaseField, BaseFieldProps } from './BaseField';

export const SelectField: React.FC<BaseFieldProps> = (props) => {
  const { field, fieldDef, value, onChange, error, disabled, required } = props;
  const options = field.customOptions || fieldDef.defaultOptions || [];

  return (
    <BaseField {...props}>
      <FormControl fullWidth size="small" error={!!error}>
        <Select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </BaseField>
  );
};
