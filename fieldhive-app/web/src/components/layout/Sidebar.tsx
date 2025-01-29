'use client';

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  width: number;
}

const menuItems = [
  {
    label: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/',
  },
  {
    label: 'Equipment',
    icon: <InventoryIcon />,
    path: '/equipment',
  },
  {
    label: 'Inspections',
    icon: <AssignmentIcon />,
    path: '/inspections',
  },
  {
    label: 'Reports',
    icon: <BarChartIcon />,
    path: '/reports',
  },
  {
    label: 'Settings',
    icon: <SettingsIcon />,
    path: '/settings',
  },
];

export default function Sidebar({ open, onClose, width }: SidebarProps) {
  const theme = useTheme();
  const pathname = usePathname();

  const content = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Image
          src="/logo.svg"
          alt="FieldHive Logo"
          width={32}
          height={32}
          priority
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          FieldHive
        </Typography>
      </Box>

      {/* Navigation */}
      <List sx={{ px: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                href={item.path}
                selected={isActive}
                sx={{
                  borderRadius: 1,
                  '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                    },
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.main,
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? 'primary.main' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Version */}
      <Box sx={{ p: 2.5, pt: 2 }}>
        <Typography variant="caption" color="text.disabled">
          Version 5.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: width },
        flexShrink: { md: 0 },
      }}
    >
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width,
            bgcolor: 'background.default',
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          },
        }}
      >
        {content}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width,
            bgcolor: 'background.default',
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          },
        }}
        open
      >
        {content}
      </Drawer>
    </Box>
  );
}
