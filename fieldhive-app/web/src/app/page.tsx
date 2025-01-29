'use client';

import { Box, Container, Typography, Paper, AppBar, Toolbar } from '@mui/material';
import dynamic from 'next/dynamic';

const SchemaBuilder = dynamic(() => import('@/components/SchemaBuilder'), {
  ssr: false,
});

export default function Home() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            FieldHive
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Equipment Type Builder
          </Typography>
          <Typography variant="body1" paragraph>
            Create and manage your equipment types and inspection forms.
          </Typography>
          <SchemaBuilder />
        </Paper>
      </Container>

      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            FieldHive © {new Date().getFullYear()}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
