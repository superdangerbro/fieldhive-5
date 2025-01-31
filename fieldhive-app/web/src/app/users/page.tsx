'use client';

import { Box, Container, Typography } from '@mui/material';
import RequireAuth from '@/components/auth/RequireAuth';
import { UserManagement } from '@/components/users/UserManagement';

export default function UsersPage() {
  return (
    <RequireAuth>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
          User Management
        </Typography>
        <Box>
          <UserManagement />
        </Box>
      </Container>
    </RequireAuth>
  );
}
