'use client';

import { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const SIDEBAR_WIDTH = 280;
const CLOSED_SIDEBAR_WIDTH = 0;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Auto-close sidebar on mobile
  const isOpen = !isMobile || sidebarOpen;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar 
        open={isOpen} 
        onClose={() => setSidebarOpen(false)}
        width={SIDEBAR_WIDTH}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${isOpen ? SIDEBAR_WIDTH : CLOSED_SIDEBAR_WIDTH}px)`,
          ml: isOpen ? `${SIDEBAR_WIDTH}px` : 0,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Header onMenuClick={() => setSidebarOpen(!isOpen)} />
        <Box 
          component="div"
          sx={{
            p: 3,
            pt: 10,
            maxWidth: '1600px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
