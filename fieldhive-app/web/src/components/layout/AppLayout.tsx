/**
 * Application Layout Component
 * 
 * Provides the main layout structure for the application including:
 * - Responsive sidebar navigation
 * - Dynamic menu items based on user role
 * - Nested menu items for admin settings
 */

'use client';

import { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import { usePermissions } from '@/hooks/usePermissions';
import { UserRoles } from '@/services/base.service';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import BuildIcon from '@mui/icons-material/Build';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupIcon from '@mui/icons-material/Group';
import SecurityIcon from '@mui/icons-material/Security';
import DashboardIcon from '@mui/icons-material/Dashboard';

const SIDEBAR_WIDTH = 280;

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isOpen = !isMobile || sidebarOpen;
  const { can } = usePermissions();

  // Define menu items based on user permissions
  const menuItems = [
    { text: 'Home', href: '/', icon: <HomeIcon /> },
  ];

  // Add admin menu items
  if (can([UserRoles.ADMIN, UserRoles.SUPER_ADMIN])) {
    menuItems.push({ text: 'Dashboard', href: '/admin/dashboard', icon: <DashboardIcon /> });
  }

  menuItems.push({ text: 'Equipment', href: '/equipment', icon: <BuildIcon /> });

  // Add settings menu for admin users
  if (can([UserRoles.ADMIN, UserRoles.SUPER_ADMIN])) {
    menuItems.push({
      text: 'Settings',
      href: '/admin/settings',
      icon: <SettingsIcon />,
      children: [
        { text: 'Users', href: '/admin/users', icon: <GroupIcon /> },
        { text: 'Permissions', href: '/admin/permissions', icon: <SecurityIcon /> },
      ],
    });
  }

  return (
    <>
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar 
        open={isOpen} 
        onClose={() => setSidebarOpen(false)}
        width={SIDEBAR_WIDTH}
        menuItems={menuItems}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { md: `${SIDEBAR_WIDTH}px` },
          mt: '64px',
          p: 3,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(isOpen && {
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        {children}
      </Box>
    </>
  );
}
