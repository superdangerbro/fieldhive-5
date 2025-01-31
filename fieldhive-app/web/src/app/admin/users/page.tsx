/**
 * Admin User Management Page
 * 
 * This page allows administrators to:
 * - View a list of all users in the system
 * - See user details including name, email, phone, and company
 * - Modify user roles based on the role hierarchy:
 *   1. CLIENT (basic access)
 *   2. PROPERTY_MANAGER (manage properties)
 *   3. TECHNICIAN (manage equipment)
 *   4. ADMIN (full system access)
 *   5. SUPER_ADMIN (system + user management)
 * 
 * Access Control:
 * - Only accessible to users with ADMIN or SUPER_ADMIN roles
 * - Protected by RequireAuth and RequirePermission components
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import { adminService, ROLE_LABELS } from '@/services/admin';
import { UserRole, UserRoles } from '@/services/base.service';
import RequireAuth from '@/components/auth/RequireAuth';
import RequirePermission from '@/components/auth/RequirePermission';

interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  company?: string;
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      await loadUsers(); // Reload users to get updated data
      setError(null);
    } catch (err) {
      console.error('Failed to update user role:', err);
      setError('Failed to update user role. Please try again.');
    }
  };

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <RequireAuth>
      <RequirePermission roles={UserRoles.ADMIN}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
            User Management
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phoneNumber}</TableCell>
                    <TableCell>{user.company || '-'}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                        size="small"
                      >
                        {Object.entries(UserRoles).map(([key, value]) => (
                          <MenuItem key={value} value={value}>
                            {ROLE_LABELS[value]}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </RequirePermission>
    </RequireAuth>
  );
}
