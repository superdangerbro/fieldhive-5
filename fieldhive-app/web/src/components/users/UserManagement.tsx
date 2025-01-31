'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { userService } from '@/services/users';
import { usePermissions } from '@/hooks/usePermissions';
import { UserRoles } from '@/services/base.service';

interface User {
  id: string;
  email: string;
  role: UserRoles;
  displayName?: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { can } = usePermissions();
  const isAdmin = can([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setOpenDialog(true);
  };

  const handleSaveUser = async (user: User) => {
    try {
      setError(null);
      if (editingUser) {
        await userService.updateUser(user);
      }
      await loadUsers();
      setOpenDialog(false);
      setEditingUser(null);
    } catch (err) {
      console.error('Failed to save user:', err);
      setError('Failed to save user. Please try again.');
    }
  };

  if (!isAdmin) {
    return <Alert severity="error">You do not have permission to access this page.</Alert>;
  }

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Display Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.displayName}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditUser(user)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Display Name"
              value={editingUser?.displayName || ''}
              onChange={(e) =>
                setEditingUser(editingUser ? { ...editingUser, displayName: e.target.value } : null)
              }
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={editingUser?.role || ''}
                onChange={(e) =>
                  setEditingUser(editingUser ? { ...editingUser, role: e.target.value as UserRoles } : null)
                }
              >
                <MenuItem value={UserRoles.USER}>User</MenuItem>
                <MenuItem value={UserRoles.ADMIN}>Admin</MenuItem>
                <MenuItem value={UserRoles.SUPER_ADMIN}>Super Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={() => editingUser && handleSaveUser(editingUser)}
            variant="contained"
            disabled={!editingUser}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
