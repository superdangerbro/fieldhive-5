import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  FormHelperText,
  Stack,
  Typography,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
  FormGroup,
  Autocomplete,
  IconButton,
  InputAdornment,
  Paper
} from '@mui/material';
import { LocalizationProvider, DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  LocationOn as LocationIcon,
  Upload as UploadIcon,
  Image as ImageIcon
} from '@mui/icons-material';

const WebFormRenderer = ({
  schema,
  fields,
  formState,
  disabled,
  readOnly
}) => {
  const renderField = (field) => {
    const commonProps = {
      fullWidth: true,
      size: "small",
      disabled: field.disabled || disabled,
      required: field.required,
      error: Boolean(field.error),
      helperText: field.error || field.description,
      sx: { mb: 2 }
    };

    switch (field.type) {
      case 'string':
        return field.multiline ? (
          <TextField
            {...commonProps}
            label={field.label || field.name}
            value={field.value || ''}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
            multiline
            rows={field.rows || 3}
          />
        ) : (
          <TextField
            {...commonProps}
            label={field.label || field.name}
            value={field.value || ''}
            onChange={(e) => field.onChange(e.target.value)}
            onBlur={field.onBlur}
          />
        );

      case 'number':
        return (
          <TextField
            {...commonProps}
            type="number"
            label={field.label || field.name}
            value={field.value || ''}
            onChange={(e) => field.onChange(Number(e.target.value))}
            onBlur={field.onBlur}
          />
        );

      case 'boolean':
        return (
          <FormControl {...commonProps} error={Boolean(field.error)}>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(field.value)}
                  onChange={(e) => field.onChange(e.target.checked)}
                  onBlur={field.onBlur}
                  disabled={field.disabled || disabled}
                />
              }
              label={field.label || field.name}
            />
            {field.error && <FormHelperText>{field.error}</FormHelperText>}
          </FormControl>
        );

      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={field.label || field.name}
              value={field.value || null}
              onChange={field.onChange}
              disabled={field.disabled || disabled}
              renderInput={(params) => (
                <TextField
                  {...params}
                  {...commonProps}
                  onBlur={field.onBlur}
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
              value={field.value || null}
              onChange={field.onChange}
              disabled={field.disabled || disabled}
              renderInput={(params) => (
                <TextField
                  {...params}
                  {...commonProps}
                  onBlur={field.onBlur}
                />
              )}
            />
          </LocalizationProvider>
        );

      case 'enum':
        return (
          <FormControl {...commonProps}>
            <InputLabel>{field.label || field.name}</InputLabel>
            <Select
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              label={field.label || field.name}
            >
              {field.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {field.error && <FormHelperText>{field.error}</FormHelperText>}
          </FormControl>
        );

      case 'array':
        if (field.arrayType === 'string' || field.arrayType === 'number') {
          return (
            <Autocomplete
              {...commonProps}
              multiple
              freeSolo
              options={[]}
              value={field.value || []}
              onChange={(_, newValue) => field.onChange(newValue)}
              onBlur={field.onBlur}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={field.label || field.name}
                  error={Boolean(field.error)}
                  helperText={field.error || field.description}
                />
              )}
            />
          );
        }
        return null;

      case 'geolocation':
        return (
          <FormControl {...commonProps}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Latitude"
                type="number"
                value={field.value?.latitude || ''}
                onChange={(e) => field.onChange({
                  ...field.value,
                  latitude: Number(e.target.value)
                })}
                onBlur={field.onBlur}
                disabled={field.disabled || disabled}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <LocationIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Longitude"
                type="number"
                value={field.value?.longitude || ''}
                onChange={(e) => field.onChange({
                  ...field.value,
                  longitude: Number(e.target.value)
                })}
                onBlur={field.onBlur}
                disabled={field.disabled || disabled}
              />
            </Box>
            {field.error && <FormHelperText error>{field.error}</FormHelperText>}
          </FormControl>
        );

      case 'file':
      case 'image':
        return (
          <FormControl {...commonProps}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                textAlign: 'center',
                cursor: field.disabled || disabled ? 'default' : 'pointer'
              }}
            >
              <input
                type="file"
                accept={field.type === 'image' ? 'image/*' : undefined}
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    field.onChange(file);
                  }
                }}
                disabled={field.disabled || disabled}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {field.type === 'image' ? <ImageIcon /> : <UploadIcon />}
                <Typography sx={{ ml: 1 }}>
                  {field.value?.name || `Upload ${field.type === 'image' ? 'Image' : 'File'}`}
                </Typography>
              </Box>
            </Paper>
            {field.error && <FormHelperText error>{field.error}</FormHelperText>}
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

  return (
    <Stack spacing={2}>
      {fields.map((field) => (
        <Box key={field.name}>
          {renderField(field)}
        </Box>
      ))}
    </Stack>
  );
};

export default WebFormRenderer;
