/**
 * Permissions Management Page
 * 
 * Allows super admins to configure role-based permissions through a user-friendly interface.
 * Displays a matrix of permissions vs roles where each cell is a toggle switch.
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
  Switch,
  Alert,
  CircularProgress,
  Stack,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { permissionsService } from '@/services/permissions';
import { UserRole, UserRoles } from '@/services/base.service';
import { Permission, PermissionCategories, SystemPermissions } from '@/types/permissions';
import RequireAuth from '@/components/auth/RequireAuth';
import RequirePermission from '@/components/auth/RequirePermission';

interface PermissionState {
  [role: string]: {
    [permissionId: string]: boolean;
  };
}

export default function PermissionsPage() {
  const [permissionState, setPermissionState] = useState<PermissionState>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Group permissions by category
  const permissionsByCategory = SystemPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const state: PermissionState = {};
      
      // Load permissions for each role
      for (const role of Object.values(UserRoles)) {
        state[role] = {};
        const permissions = await permissionsService.getRolePermissions(role);
        
        // Set initial state for each permission
        SystemPermissions.forEach(permission => {
          state[role][permission.id] = permissions.includes(permission.id);
        });
      }

      setPermissionState(state);
      setError(null);
    } catch (err) {
      console.error('Failed to load permissions:', err);
      setError('Failed to load permissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = async (role: UserRole, permissionId: string) => {
    try {
      setSaving(true);
      
      // Update local state
      const newState = {
        ...permissionState,
        [role]: {
          ...permissionState[role],
          [permissionId]: !permissionState[role][permissionId],
        },
      };
      setPermissionState(newState);

      // Update in database
      const updatedPermissions = Object.entries(newState[role])
        .filter(([, enabled]) => enabled)
        .map(([id]) => id);

      await permissionsService.updateRolePermissions(role, updatedPermissions);
      setError(null);
    } catch (err) {
      console.error('Failed to update permission:', err);
      setError('Failed to update permission. Please try again.');
      
      // Revert local state on error
      await loadPermissions();
    } finally {
      setSaving(false);
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
      <RequirePermission roles={UserRoles.SUPER_ADMIN}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Permissions Management
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {saving && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Saving changes...
            </Alert>
          )}

          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" color="text.secondary" paragraph>
              Configure which roles have access to specific features and actions.
              Changes take effect immediately.
            </Typography>
          </Box>

          {Object.entries(permissionsByCategory).map(([category, permissions]) => (
            <Accordion key={category} defaultExpanded sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{category}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Permission</TableCell>
                        {Object.values(UserRoles).map((role) => (
                          <TableCell key={role} align="center">
                            {role.replace('_', ' ').toUpperCase()}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {permissions.map((permission) => (
                        <TableRow key={permission.id}>
                          <TableCell>
                            <Typography variant="body2">{permission.name}</Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {permission.description}
                            </Typography>
                          </TableCell>
                          {Object.values(UserRoles).map((role) => (
                            <TableCell key={role} align="center">
                              <Switch
                                size="small"
                                checked={permissionState[role]?.[permission.id] || false}
                                onChange={() => handlePermissionChange(role, permission.id)}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </RequirePermission>
    </RequireAuth>
  );
}
