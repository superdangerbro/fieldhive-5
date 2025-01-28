import React from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Paper,
  Divider,
  Stack,
  FormHelperText
} from '@mui/material';
import { LocalizationProvider, DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const FieldPreview = ({ field, value, onChange, error }) => {
  switch (field.type) {
    case 'string':
      return (
        <TextField
          fullWidth
          label={field.label || field.name}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          size="small"
          required={field.required}
          error={Boolean(error)}
          helperText={error || field.description}
          multiline={field.multiline}
          rows={field.multiline ? 3 : 1}
        />
      );

    case 'number':
      return (
        <TextField
          fullWidth
          label={field.label || field.name}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          size="small"
          required={field.required}
          error={Boolean(error)}
          helperText={error || field.description}
          type="number"
        />
      );

    case 'boolean':
      return (
        <FormControlLabel
          control={
            <Switch
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
              size="small"
            />
          }
          label={field.label || field.name}
        />
      );

    case 'date':
      return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label={field.label || field.name}
            value={value || null}
            onChange={onChange}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                size="small"
                required={field.required}
                error={Boolean(error)}
                helperText={error || field.description}
              />
            )}
          />
        </LocalizationProvider>
      );

    case 'timestamp':
      return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label={field.label || field.name}
            value={value || null}
            onChange={onChange}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                size="small"
                required={field.required}
                error={Boolean(error)}
                helperText={error || field.description}
              />
            )}
          />
        </LocalizationProvider>
      );

    case 'enum':
      return (
        <FormControl 
          fullWidth 
          size="small"
          error={Boolean(error)}
          required={field.required}
        >
          <InputLabel>{field.label || field.name}</InputLabel>
          <Select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            label={field.label || field.name}
          >
            {(field.options || []).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          {(error || field.description) && (
            <FormHelperText>{error || field.description}</FormHelperText>
          )}
        </FormControl>
      );

    case 'reference':
      return (
        <FormControl 
          fullWidth 
          size="small"
          error={Boolean(error)}
          required={field.required}
        >
          <InputLabel>{field.label || field.name}</InputLabel>
          <Select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            label={field.label || field.name}
          >
            <MenuItem value="">
              <em>Select {field.collection}</em>
            </MenuItem>
          </Select>
          {(error || field.description) && (
            <FormHelperText>{error || field.description}</FormHelperText>
          )}
        </FormControl>
      );

    default:
      return (
        <Typography color="error">
          Unsupported field type: {field.type}
        </Typography>
      );
  }
};

const SchemaPreview = ({ schema, data, onDataChange }) => {
  const handleFieldChange = (fieldName, value) => {
    onDataChange({
      ...data,
      [fieldName]: value
    });
  };

  if (!schema.fields || schema.fields.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="textSecondary">
          Add fields to see a preview
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {schema.fields.map((field) => (
        <Box key={field.id}>
          <FieldPreview
            field={field}
            value={data[field.name]}
            onChange={(value) => handleFieldChange(field.name, value)}
            error={null} // Add validation logic here
          />
        </Box>
      ))}
    </Stack>
  );
};

export default SchemaPreview;
