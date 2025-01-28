import React, { useState, useEffect } from 'react';
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
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  AddCircleOutline as AddConditionIcon
} from '@mui/icons-material';
import { ConditionTypes, Operators, LogicalOperators } from '../../../../shared/schemas/conditions';

const ConditionGroup = ({ 
  group, 
  onUpdate, 
  onDelete, 
  availableSchemas,
  getSchemaFields 
}) => {
  const handleLogicalOperatorChange = (value) => {
    onUpdate({
      ...group,
      logicalOperator: value
    });
  };

  const handleConditionUpdate = (index, condition) => {
    const newConditions = [...group.conditions];
    newConditions[index] = condition;
    onUpdate({
      ...group,
      conditions: newConditions
    });
  };

  const handleAddCondition = () => {
    onUpdate({
      ...group,
      conditions: [
        ...group.conditions,
        {
          sourceSchema: '',
          sourceField: '',
          operator: Operators.EQUALS,
          value: ''
        }
      ]
    });
  };

  const handleRemoveCondition = (index) => {
    onUpdate({
      ...group,
      conditions: group.conditions.filter((_, i) => i !== index)
    });
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Logic</InputLabel>
              <Select
                value={group.logicalOperator || LogicalOperators.AND}
                onChange={(e) => handleLogicalOperatorChange(e.target.value)}
                label="Logic"
              >
                <MenuItem value={LogicalOperators.AND}>AND</MenuItem>
                <MenuItem value={LogicalOperators.OR}>OR</MenuItem>
              </Select>
            </FormControl>
            <IconButton onClick={onDelete} size="small" color="error">
              <DeleteIcon />
            </IconButton>
          </Box>

          {group.conditions.map((condition, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Schema</InputLabel>
                <Select
                  value={condition.sourceSchema}
                  onChange={(e) => handleConditionUpdate(index, {
                    ...condition,
                    sourceSchema: e.target.value,
                    sourceField: ''
                  })}
                  label="Schema"
                >
                  {availableSchemas.map(schema => (
                    <MenuItem key={schema.name} value={schema.name}>
                      {schema.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Field</InputLabel>
                <Select
                  value={condition.sourceField}
                  onChange={(e) => handleConditionUpdate(index, {
                    ...condition,
                    sourceField: e.target.value
                  })}
                  label="Field"
                  disabled={!condition.sourceSchema}
                >
                  {condition.sourceSchema && getSchemaFields(condition.sourceSchema).map(field => (
                    <MenuItem key={field.name} value={field.name}>
                      {field.label || field.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Operator</InputLabel>
                <Select
                  value={condition.operator}
                  onChange={(e) => handleConditionUpdate(index, {
                    ...condition,
                    operator: e.target.value
                  })}
                  label="Operator"
                >
                  {Object.entries(Operators).map(([key, value]) => (
                    <MenuItem key={key} value={value}>
                      {key.replace(/_/g, ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                size="small"
                label="Value"
                value={condition.value || ''}
                onChange={(e) => handleConditionUpdate(index, {
                  ...condition,
                  value: e.target.value
                })}
              />

              <IconButton 
                onClick={() => handleRemoveCondition(index)} 
                size="small"
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          <Button
            startIcon={<AddConditionIcon />}
            onClick={handleAddCondition}
            size="small"
          >
            Add Condition
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

const ConditionalLogicBuilder = ({
  rule,
  onChange,
  availableSchemas,
  getSchemaFields
}) => {
  const handleAddGroup = () => {
    onChange({
      ...rule,
      conditions: [
        ...rule.conditions,
        {
          logicalOperator: LogicalOperators.AND,
          conditions: [
            {
              sourceSchema: '',
              sourceField: '',
              operator: Operators.EQUALS,
              value: ''
            }
          ]
        }
      ]
    });
  };

  const handleGroupUpdate = (index, group) => {
    const newConditions = [...rule.conditions];
    newConditions[index] = group;
    onChange({
      ...rule,
      conditions: newConditions
    });
  };

  const handleGroupDelete = (index) => {
    onChange({
      ...rule,
      conditions: rule.conditions.filter((_, i) => i !== index)
    });
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Conditions
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {rule.conditions.map((group, index) => (
        <ConditionGroup
          key={index}
          group={group}
          onUpdate={(updated) => handleGroupUpdate(index, updated)}
          onDelete={() => handleGroupDelete(index)}
          availableSchemas={availableSchemas}
          getSchemaFields={getSchemaFields}
        />
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={handleAddGroup}
        variant="outlined"
        size="small"
        fullWidth
      >
        Add Condition Group
      </Button>
    </Box>
  );
};

export default ConditionalLogicBuilder;
