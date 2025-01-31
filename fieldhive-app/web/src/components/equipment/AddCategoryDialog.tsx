'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import { equipmentService } from '@/services/equipment';

interface AddCategoryDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddCategoryDialog({ open, onClose }: AddCategoryDialogProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await equipmentService.addCategory(name);
      setName('');
      onClose();
    } catch (error) {
      console.error('Failed to add category:', error);
      // TODO: Show error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add Equipment Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ mt: 2 }}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={!name.trim() || loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Add Category
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
