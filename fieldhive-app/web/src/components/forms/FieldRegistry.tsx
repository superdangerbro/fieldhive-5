import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { formService } from '@/services/forms';
import { FieldDefinition, FieldType } from '@/types/forms';

interface FieldRegistryProps {
  category: string;
  subcategoryId?: string;
  onFieldSelect?: (field: FieldDefinition) => void;
}

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'select', label: 'Select' },
  { value: 'multiselect', label: 'Multi-Select' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
  { value: 'barcode', label: 'Barcode Scanner' },
  { value: 'image', label: 'Image' },
  { value: 'slider', label: 'Slider' },
  { value: 'updownSelect', label: 'Up/Down Select' },
];

export const FieldRegistry: React.FC<FieldRegistryProps> = ({
  category,
  subcategoryId,
  onFieldSelect,
}) => {
  const [fields, setFields] = useState<FieldDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingField, setEditingField] = useState<FieldDefinition | null>(null);
  
  // Form state
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState<FieldType>('text');
  const [fieldDescription, setFieldDescription] = useState('');
  const [fieldOptions, setFieldOptions] = useState<string>('');

  useEffect(() => {
    loadFields();
  }, [category, subcategoryId]);

  const loadFields = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await formService.getFieldDefinitions(category, subcategoryId);
      setFields(data);
    } catch (err) {
      console.error('Failed to load fields:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = () => {
    setEditingField(null);
    setFieldName('');
    setFieldType('text');
    setFieldDescription('');
    setFieldOptions('');
    setOpenDialog(true);
  };

  const handleEditField = (field: FieldDefinition) => {
    setEditingField(field);
    setFieldName(field.name);
    setFieldType(field.type);
    setFieldDescription(field.description);
    setFieldOptions(field.defaultOptions?.map(opt => \`\${opt.value}|\${opt.label}\`).join('\\n') || '');
    setOpenDialog(true);
  };

  const handleSaveField = async () => {
    try {
      const fieldData = {
        name: fieldName,
        type: fieldType,
        description: fieldDescription,
        category,
        subcategoryId,
        defaultOptions: fieldType === 'select' || fieldType === 'multiselect'
          ? fieldOptions.split('\\n')
              .filter(line => line.trim())
              .map(line => {
                const [value, label] = line.split('|').map(s => s.trim());
                return { value, label: label || value };
              })
          : undefined,
      };

      if (editingField) {
        await formService.updateFieldDefinition(editingField.id, fieldData);
      } else {
        await formService.createFieldDefinition(fieldData);
      }

      setOpenDialog(false);
      loadFields();
    } catch (err) {
      console.error('Failed to save field:', err);
      // TODO: Show error message to user
    }
  };

  const handleDuplicate = (field: FieldDefinition) => {
    if (onFieldSelect) {
      onFieldSelect(field);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Typography color="error">
        Error loading fields: {error.message}
      </Typography>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Field Registry</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddField}
        >
          Add Field
        </Button>
      </Box>

      <Paper>
        <List>
          {fields.map((field) => (
            <ListItem key={field.id} divider>
              <ListItemText
                primary={field.name}
                secondary={
                  <>
                    <Typography variant="caption" component="span">
                      Type: {field.type}
                    </Typography>
                    <br />
                    <Typography variant="caption" component="span">
                      {field.description}
                    </Typography>
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleEditField(field)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                {onFieldSelect && (
                  <IconButton
                    edge="end"
                    onClick={() => handleDuplicate(field)}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingField ? 'Edit Field' : 'Add New Field'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Field Name"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              fullWidth
              required
            />

            <FormControl fullWidth required>
              <InputLabel>Field Type</InputLabel>
              <Select
                value={fieldType}
                onChange={(e) => setFieldType(e.target.value as FieldType)}
                label="Field Type"
                disabled={!!editingField}
              >
                {FIELD_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Description"
              value={fieldDescription}
              onChange={(e) => setFieldDescription(e.target.value)}
              fullWidth
              multiline
              rows={2}
            />

            {(fieldType === 'select' || fieldType === 'multiselect') && (
              <TextField
                label="Options (one per line, format: value|label)"
                value={fieldOptions}
                onChange={(e) => setFieldOptions(e.target.value)}
                fullWidth
                multiline
                rows={4}
                placeholder="option1|Option 1\\noption2|Option 2"
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveField} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
