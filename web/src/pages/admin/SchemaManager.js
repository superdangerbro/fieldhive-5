import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import SchemaBuilder from '../../components/SchemaBuilder';
import { createCollection, getDocument, saveDocument, deleteDocument } from '../../../../shared/schemas/firestore';
import { validateSchemaDefinition } from '../../../../shared/schemas/validation';
import { SCHEMA_COLLECTION } from '../../../../shared/schemas/schemaManager';

const SchemaManager = () => {
  const [schemas, setSchemas] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isNewSchemaDialogOpen, setIsNewSchemaDialogOpen] = useState(false);
  const [newSchemaName, setNewSchemaName] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Load schemas from Firestore
  useEffect(() => {
    const loadSchemas = async () => {
      try {
        const snapshot = await db.collection(SCHEMA_COLLECTION).get();
        const loadedSchemas = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSchemas(loadedSchemas);
      } catch (error) {
        showSnackbar(`Error loading schemas: ${error.message}`, 'error');
      }
    };

    loadSchemas();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCreateSchema = async () => {
    if (!newSchemaName.trim()) {
      showSnackbar('Schema name is required', 'error');
      return;
    }

    try {
      const newSchema = {
        name: newSchemaName.trim(),
        description: '',
        fields: [],
        rules: []
      };

      const result = await createCollection(newSchema);
      setSchemas([...schemas, { ...newSchema, id: result.id }]);
      setNewSchemaName('');
      setIsNewSchemaDialogOpen(false);
      showSnackbar('Schema created successfully');
    } catch (error) {
      showSnackbar(`Error creating schema: ${error.message}`, 'error');
    }
  };

  const handleEditSchema = async (schema) => {
    setSelectedSchema(schema);
    setIsEditorOpen(true);
  };

  const handleDeleteSchema = async (schemaId) => {
    if (!window.confirm('Are you sure you want to delete this schema?')) {
      return;
    }

    try {
      await deleteDocument(SCHEMA_COLLECTION, schemaId);
      setSchemas(schemas.filter(s => s.id !== schemaId));
      showSnackbar('Schema deleted successfully');
    } catch (error) {
      showSnackbar(`Error deleting schema: ${error.message}`, 'error');
    }
  };

  const handleSaveSchema = async (updatedSchema) => {
    try {
      const validationResult = validateSchemaDefinition(updatedSchema);
      if (!validationResult.valid) {
        showSnackbar(`Invalid schema: ${validationResult.errors.join(', ')}`, 'error');
        return;
      }

      await saveDocument(SCHEMA_COLLECTION, updatedSchema);
      setSchemas(schemas.map(s => s.id === updatedSchema.id ? updatedSchema : s));
      setIsEditorOpen(false);
      setSelectedSchema(null);
      showSnackbar('Schema saved successfully');
    } catch (error) {
      showSnackbar(`Error saving schema: ${error.message}`, 'error');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Schema Manager</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsNewSchemaDialogOpen(true)}
        >
          Create Schema
        </Button>
      </Box>

      <Paper sx={{ mb: 4 }}>
        <List>
          {schemas.map((schema) => (
            <React.Fragment key={schema.id}>
              <ListItem>
                <ListItemText
                  primary={schema.name}
                  secondary={`${schema.fields?.length || 0} fields, ${schema.rules?.length || 0} rules`}
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Edit Schema">
                    <IconButton onClick={() => handleEditSchema(schema)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Schema">
                    <IconButton onClick={() => handleDeleteSchema(schema.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
          {schemas.length === 0 && (
            <ListItem>
              <ListItemText
                primary="No schemas defined"
                secondary="Click 'Create Schema' to add one"
              />
            </ListItem>
          )}
        </List>
      </Paper>

      {/* New Schema Dialog */}
      <Dialog
        open={isNewSchemaDialogOpen}
        onClose={() => setIsNewSchemaDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Schema</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Schema Name"
            fullWidth
            value={newSchemaName}
            onChange={(e) => setNewSchemaName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsNewSchemaDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateSchema} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Schema Editor Dialog */}
      <Dialog
        open={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        maxWidth="xl"
        fullScreen
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Edit Schema: {selectedSchema?.name}
            </Typography>
            <Box>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() => handleSaveSchema(selectedSchema)}
                sx={{ mr: 1 }}
              >
                Save
              </Button>
              <IconButton onClick={() => setIsEditorOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedSchema && (
            <SchemaBuilder
              initialSchema={selectedSchema}
              onSave={handleSaveSchema}
              availableSchemas={schemas.filter(s => s.id !== selectedSchema.id)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SchemaManager;
