import React, { useState, useCallback } from 'react';
import { Box, Paper, Typography, Divider, Tabs, Tab } from '@mui/material';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

import FieldList from './FieldList';
import FieldEditor from './FieldEditor';
import SchemaPreview from './SchemaPreview';
import RuleBuilder from './RuleBuilder';
import { FieldTypes } from '../../../../shared/schemas/base';

const SchemaBuilder = ({ initialSchema, onSave, availableSchemas = [] }) => {
  const [schema, setSchema] = useState(initialSchema || {
    name: '',
    description: '',
    fields: [],
    rules: []
  });

  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);
  const [previewData, setPreviewData] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  // DnD sensors configuration
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle tab changes
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle field selection
  const handleFieldSelect = (index) => {
    setSelectedFieldIndex(index);
  };

  // Handle field updates
  const handleFieldUpdate = (fieldData) => {
    if (selectedFieldIndex === null) return;

    const newFields = [...schema.fields];
    newFields[selectedFieldIndex] = fieldData;
    setSchema({ ...schema, fields: newFields });
  };

  // Handle field reordering
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = schema.fields.findIndex(field => field.id === active.id);
    const newIndex = schema.fields.findIndex(field => field.id === over.id);

    setSchema({
      ...schema,
      fields: arrayMove(schema.fields, oldIndex, newIndex)
    });

    if (selectedFieldIndex === oldIndex) {
      setSelectedFieldIndex(newIndex);
    }
  };

  // Handle adding a new field
  const handleAddField = (type) => {
    const newField = {
      id: `field-${Date.now()}`,
      name: '',
      type,
      label: '',
      required: false,
      description: ''
    };

    setSchema({
      ...schema,
      fields: [...schema.fields, newField]
    });
    setSelectedFieldIndex(schema.fields.length);
  };

  // Handle removing a field
  const handleRemoveField = (index) => {
    const newFields = schema.fields.filter((_, i) => i !== index);
    setSchema({ ...schema, fields: newFields });
    setSelectedFieldIndex(null);
  };

  // Handle schema metadata updates
  const handleSchemaUpdate = (updates) => {
    setSchema({ ...schema, ...updates });
  };

  // Handle preview data updates
  const handlePreviewDataUpdate = (data) => {
    setPreviewData(data);
  };

  // Handle rules updates
  const handleRulesUpdate = (rules) => {
    setSchema({ ...schema, rules });
  };

  // Get fields from a schema
  const getSchemaFields = useCallback((schemaName) => {
    if (schemaName === schema.name) {
      return schema.fields;
    }
    const targetSchema = availableSchemas.find(s => s.name === schemaName);
    return targetSchema?.fields || [];
  }, [schema, availableSchemas]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2, p: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Fields" />
          <Tab label="Rules" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Box sx={{ display: 'flex', height: '100%', gap: 2 }}>
          {/* Left Panel - Field List */}
          <Paper sx={{ width: 300, p: 2 }}>
            <Typography variant="h6" gutterBottom>Fields</Typography>
            <Divider sx={{ my: 2 }} />
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={schema.fields.map(f => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <FieldList
                  fields={schema.fields}
                  selectedIndex={selectedFieldIndex}
                  onFieldSelect={handleFieldSelect}
                  onAddField={handleAddField}
                  onRemoveField={handleRemoveField}
                  availableTypes={Object.values(FieldTypes)}
                />
              </SortableContext>
            </DndContext>
          </Paper>

          {/* Middle Panel - Field Editor */}
          <Paper sx={{ flex: 1, p: 2 }}>
            <Typography variant="h6" gutterBottom>Field Properties</Typography>
            <Divider sx={{ my: 2 }} />
            {selectedFieldIndex !== null && (
              <FieldEditor
                field={schema.fields[selectedFieldIndex]}
                availableTypes={Object.values(FieldTypes)}
                onChange={handleFieldUpdate}
              />
            )}
          </Paper>

          {/* Right Panel - Preview */}
          <Paper sx={{ width: 400, p: 2 }}>
            <Typography variant="h6" gutterBottom>Preview</Typography>
            <Divider sx={{ my: 2 }} />
            <SchemaPreview
              schema={schema}
              data={previewData}
              onDataChange={handlePreviewDataUpdate}
            />
          </Paper>
        </Box>
      )}

      {activeTab === 1 && (
        <Box sx={{ height: '100%', overflow: 'auto' }}>
          <Paper sx={{ p: 2 }}>
            <RuleBuilder
              rules={schema.rules || []}
              onChange={handleRulesUpdate}
              availableSchemas={[schema, ...availableSchemas]}
              getSchemaFields={getSchemaFields}
            />
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default SchemaBuilder;
