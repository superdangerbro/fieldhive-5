'use client';

import { Box, Typography } from '@mui/material';
import RequireAuth from '@/components/auth/RequireAuth';

/**
 * Home Page Component
 * 
 * The main landing page for authenticated users.
 * Currently displays a simple welcome message.
 * Will be enhanced with dashboard features in future iterations.
 */
export default function HomePage() {
  return (
    <RequireAuth>
      <Box>
        <Typography>This is the homepage</Typography>
      </Box>
    </RequireAuth>
  );
}
