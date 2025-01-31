'use client';

import { Box, Container, Typography, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import { FieldRegistry } from '@/components/forms/FieldRegistry';
import { UserManagement } from '@/components/users/UserManagement';
import RequireAuth from '@/components/auth/RequireAuth';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <RequireAuth>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
          Settings
        </Typography>

        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab label="Field Registry" />
          <Tab label="Users" />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            <FieldRegistry category="equipment" />
          </Box>
        )}
        
        {activeTab === 1 && (
          <Box>
            <UserManagement />
          </Box>
        )}
      </Container>
    </RequireAuth>
  );
}
