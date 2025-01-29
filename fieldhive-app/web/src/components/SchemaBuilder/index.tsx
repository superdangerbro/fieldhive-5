'use client';

import { useState } from 'react';
import { Box, Button, TextField, Grid, Paper, IconButton, Typography, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm, useFieldArray, Controller, Control } from 'react-hook-form';

interface Field {
  name: string;
  type: string;
  required: boolean;
}

interface Schema {
  name: string;
  description: string;
  fields: Field[];
}

interface ControlledTextFieldProps {
  control: Control<Schema>;
  name: any;
  label: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  select?: boolean;
  SelectProps?: any;
  children?: React.ReactNode;
}

const ControlledTextField = ({ 
  control, 
  name, 
  label, 
  required, 
  multiline, 
  rows,
  select,
  SelectProps,
  children
}: ControlledTextFieldProps) => (
  <Controller
    name={name}
    control={control}
    rules={{ required }}
    render={({ field }) => (
      <TextField
        {...field}
        label={label}
        fullWidth
        required={required}
        multiline={multiline}
        rows={rows}
        select={select}
        SelectProps={SelectProps}
      >
        {children}
      </TextField>
    )}
  />
);

export default function SchemaBuilder() {
  const { control, handleSubmit } = useForm<Schema>({
    defaultValues: {
      name: '',
      description: '',
      fields: [{ name: '', type: 'text', required: true }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fields'
  });

  const onSubmit = async (data: Schema) => {
    try {
      console.log('Saving schema:', data);
      // TODO: Save to Firestore
    } catch (error) {
      console.error('Error saving schema:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ControlledTextField
            control={control}
            name="name"
            label="Equipment Type Name"
            required
          />
        </Grid>

        <Grid item xs={12}>
          <ControlledTextField
            control={control}
            name="description"
            label="Description"
            multiline
            rows={2}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Inspection Fields
          </Typography>
          {fields.map((field, index) => (
            <Paper key={field.id} sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={5}>
                  <ControlledTextField
                    control={control}
                    name={`fields.${index}.name`}
                    label="Field Name"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <ControlledTextField
                    control={control}
                    name={`fields.${index}.type`}
                    label="Field Type"
                    required
                    select
                    SelectProps={{
                      native: true
                    }}
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="select">Select</option>
                    <option value="boolean">Yes/No</option>
                  </ControlledTextField>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <IconButton onClick={() => remove(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={() => append({ name: '', type: 'text', required: true })}
            variant="outlined"
            sx={{ mt: 2 }}
          >
            Add Field
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
          >
            Save Equipment Type
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
