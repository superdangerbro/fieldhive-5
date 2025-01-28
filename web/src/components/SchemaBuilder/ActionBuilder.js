import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { ConditionTypes } from '../../../../shared/schemas/conditions';

const ActionItem = ({
  action,
  onUpdate,
  onDelete,
  availableSchemas,
  getSchemaFields
}) => {
  const handleTypeChange = (value) => {
    onUpdate({
      ...action,
      type: value,
      value: action.type === ConditionTypes.SET_VALUE ? '' : action.value
    });
  };

  const handleValueChange = (value) => {
    onUpdate({
      ...action,
      value: value
    });
  };

  const renderValueInput = () => {
    if (action.type === ConditionTypes.SHOW || action.type === ConditionTypes.REQUIRE) {
      return (
        <FormControlLabel
          control={
            <Switch
              checked={Boolean(action.value)}
              onChange={(e) => handleValueChange(e.target.checked)}
              size="small"
            />
          }
          label={action.type === ConditionTypes.SHOW ? "Visible" : "Required"}
        />
      );
    }

    if (action.type === ConditionTypes.SET_VALUE) {
      return (
        <TextField
          size="small"
          label="Value"
          value={action.value || ''}
          onChange={(e) => handleValueChange(e.target.value)}
          fullWidth
        />
      );
    }

    return null;
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Action Type</InputLabel>
              <Select
                value={action.type}
                onChange={(e) => handleTypeChange(e.target.value)}
                label="Action Type"
              >
                <MenuItem value={ConditionTypes.SHOW}>Show/Hide</MenuItem>
                <MenuItem value={ConditionTypes.REQUIRE}>Required/Optional</MenuItem>
                <MenuItem value={ConditionTypes.SET_VALUE}>Set Value</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Target Schema</InputLabel>
              <Select
                value={action.targetSchema}
                onChange={(e) => onUpdate({
                  ...action,
                  targetSchema: e.target.value,
                  targetField: ''
                })}
                label="Target Schema"
              >
                {availableSchemas.map(schema => (
                  <MenuItem key={schema.name} value={schema.name}>
                    {schema.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Target Field</InputLabel>
              <Select
                value={action.targetField}
                onChange={(e) => onUpdate({
                  ...action,
                  targetField: e.target.value
                })}
                label="Target Field"
                disabled={!action.targetSchema}
              >
                {action.targetSchema && getSchemaFields(action.targetSchema).map(field => (
                  <MenuItem key={field.name} value={field.name}>
                    {field.label || field.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {renderValueInput()}

            <IconButton 
              onClick={onDelete} 
              size="small"
              color="error"
              sx={{ mt: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

const ActionBuilder = ({
  rule,
  onChange,
  availableSchemas,
  getSchemaFields
}) => {
  const handleAddAction = () => {
    onChange({
      ...rule,
      actions: [
        ...rule.actions,
        {
          type: ConditionTypes.SHOW,
          targetSchema: '',
          targetField: '',
          value: true
        }
      ]
    });
  };

  const handleActionUpdate = (index, action) => {
    const newActions = [...rule.actions];
    newActions[index] = action;
    onChange({
      ...rule,
      actions: newActions
    });
  };

  const handleActionDelete = (index) => {
    onChange({
      ...rule,
      actions: rule.actions.filter((_, i) => i !== index)
    });
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Actions
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {rule.actions.map((action, index) => (
        <ActionItem
          key={index}
          action={action}
          onUpdate={(updated) => handleActionUpdate(index, updated)}
          onDelete={() => handleActionDelete(index)}
          availableSchemas={availableSchemas}
          getSchemaFields={getSchemaFields}
        />
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={handleAddAction}
        variant="outlined"
        size="small"
        fullWidth
      >
        Add Action
      </Button>
    </Box>
  );
};

export default ActionBuilder;
