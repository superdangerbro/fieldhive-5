import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  TextField,
  Typography,
  Divider,
  Stack,
  Collapse,
  FormControlLabel,
  Switch,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import ConditionalLogicBuilder from './ConditionalLogicBuilder';
import ActionBuilder from './ActionBuilder';

const RuleItem = ({
  rule,
  onUpdate,
  onDelete,
  availableSchemas,
  getSchemaFields
}) => {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardHeader
        title={
          <TextField
            value={rule.name || ''}
            onChange={(e) => onUpdate({ ...rule, name: e.target.value })}
            placeholder="Rule Name"
            variant="standard"
            fullWidth
            sx={{ mr: 2 }}
          />
        }
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={rule.enabled}
                  onChange={(e) => onUpdate({ ...rule, enabled: e.target.checked })}
                  size="small"
                />
              }
              label="Enabled"
            />
            <IconButton onClick={handleExpandClick}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            <IconButton onClick={onDelete} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        }
      />
      <Collapse in={expanded}>
        <CardContent>
          <TextField
            value={rule.description || ''}
            onChange={(e) => onUpdate({ ...rule, description: e.target.value })}
            placeholder="Rule Description"
            multiline
            rows={2}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          />

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Conditions" />
              <Tab label="Actions" />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <ConditionalLogicBuilder
              rule={rule}
              onChange={onUpdate}
              availableSchemas={availableSchemas}
              getSchemaFields={getSchemaFields}
            />
          )}

          {activeTab === 1 && (
            <ActionBuilder
              rule={rule}
              onChange={onUpdate}
              availableSchemas={availableSchemas}
              getSchemaFields={getSchemaFields}
            />
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

const RuleBuilder = ({
  rules,
  onChange,
  availableSchemas,
  getSchemaFields
}) => {
  const handleAddRule = () => {
    const newRule = {
      id: `rule-${Date.now()}`,
      name: '',
      description: '',
      enabled: true,
      conditions: [],
      actions: [],
      priority: rules.length
    };

    onChange([...rules, newRule]);
  };

  const handleUpdateRule = (index, updatedRule) => {
    const newRules = [...rules];
    newRules[index] = updatedRule;
    onChange(newRules);
  };

  const handleDeleteRule = (index) => {
    onChange(rules.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Conditional Rules
        </Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddRule}
          variant="contained"
          size="small"
        >
          Add Rule
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {rules.length === 0 ? (
        <Typography color="textSecondary" align="center">
          No rules defined yet. Click "Add Rule" to create one.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {rules.map((rule, index) => (
            <RuleItem
              key={rule.id}
              rule={rule}
              onUpdate={(updated) => handleUpdateRule(index, updated)}
              onDelete={() => handleDeleteRule(index)}
              availableSchemas={availableSchemas}
              getSchemaFields={getSchemaFields}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default RuleBuilder;
