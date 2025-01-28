import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  IconButton,
  Typography,
  Divider,
  Chip,
  Stack,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const FieldEditor = ({ field, availableTypes, onChange }) => {
  const [localField, setLocalField] = useState(field);
  const [newOption, setNewOption] = useState('');

  useEffect(() => {
    setLocalField(field);
  }, [field]);

  const handleChange = (key, value) => {
    const updatedField = { ...localField, [key]: value };
    setLocalField(updatedField);
    onChange(updatedField);
  };

  const handleAddOption = () => {
    if (!newOption.trim()) return;
    
    const options = localField.options || [];
    if (!options.includes(newOption)) {
      handleChange('options', [...options, newOption]);
    }
    setNewOption('');
  };

  const handleRemoveOption = (optionToRemove) => {
    const options = localField.options || [];
    handleChange('options', options.filter(option => option !== optionToRemove));
  };

  const renderTypeSpecificFields = () => {
    switch (localField.type) {
      case 'enum':
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Options</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                size="small"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Add new option"
                fullWidth
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleAddOption}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
            <Paper variant="outlined" sx={{ p: 1, mt: 1 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {(localField.options || []).map((option, index) => (
                  <Chip
                    key={index}
                    label={option}
                    onDelete={() => handleRemoveOption(option)}
                    size="small"
                  />
                ))}
              </Stack>
            </Paper>
          </Box>
        );

      case 'reference':
        return (
          <TextField
            fullWidth
            label="Collection Name"
            value={localField.collection || ''}
            onChange={(e) => handleChange('collection', e.target.value)}
            size="small"
            sx={{ mt: 2 }}
          />
        );

      case 'array':
        return (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="array-type-label">Array Type</InputLabel>
            <Select
              labelId="array-type-label"
              value={localField.arrayType || 'string'}
              onChange={(e) => handleChange('arrayType', e.target.value)}
              size="small"
              label="Array Type"
            >
              {availableTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        fullWidth
        label="Field Name"
        value={localField.name}
        onChange={(e) => handleChange('name', e.target.value)}
        size="small"
        required
      />

      <FormControl fullWidth>
        <InputLabel id="type-label">Type</InputLabel>
        <Select
          labelId="type-label"
          value={localField.type}
          onChange={(e) => handleChange('type', e.target.value)}
          size="small"
          label="Type"
        >
          {availableTypes.map(type => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Label"
        value={localField.label || ''}
        onChange={(e) => handleChange('label', e.target.value)}
        size="small"
      />

      <TextField
        fullWidth
        label="Description"
        value={localField.description || ''}
        onChange={(e) => handleChange('description', e.target.value)}
        size="small"
        multiline
        rows={2}
      />

      <FormControlLabel
        control={
          <Switch
            checked={localField.required || false}
            onChange={(e) => handleChange('required', e.target.checked)}
            size="small"
          />
        }
        label="Required"
      />

      {renderTypeSpecificFields()}

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          Advanced Properties
        </Typography>
        <Divider />
        
        <TextField
          fullWidth
          label="Default Value"
          value={localField.defaultValue || ''}
          onChange={(e) => handleChange('defaultValue', e.target.value)}
          size="small"
          sx={{ mt: 2 }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={localField.searchable || false}
              onChange={(e) => handleChange('searchable', e.target.checked)}
              size="small"
            />
          }
          label="Searchable"
        />

        <FormControlLabel
          control={
            <Switch
              checked={localField.unique || false}
              onChange={(e) => handleChange('unique', e.target.checked)}
              size="small"
            />
          }
          label="Unique"
        />
      </Box>
    </Box>
  );
};

export default FieldEditor;
