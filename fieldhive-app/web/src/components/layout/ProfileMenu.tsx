'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { alpha } from '@mui/material/styles';
import { auth } from '@/lib/firebase';

export default function ProfileMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      handleClose();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    {
      label: 'Profile',
      icon: <PersonIcon fontSize="small" />,
      onClick: () => {
        console.log('Profile clicked');
        handleClose();
      },
    },
    {
      label: 'Settings',
      icon: <SettingsIcon fontSize="small" />,
      onClick: () => {
        console.log('Settings clicked');
        handleClose();
      },
    },
    {
      label: 'Logout',
      icon: <LogoutIcon fontSize="small" />,
      onClick: handleLogout,
      divider: true,
    },
  ];

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          J
        </Avatar>
      </IconButton>

      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            width: 200,
            boxShadow: theme.customShadows.dropdown,
            '& .MuiMenuItem-root': {
              py: 1,
              px: 2.5,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.04),
              },
            },
          },
        }}
      >
        {menuItems.map((item, index) => (
          <Box key={item.label}>
            {item.divider && index > 0 && <Divider sx={{ my: 1 }} />}
            <MenuItem onClick={item.onClick}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </MenuItem>
          </Box>
        ))}
      </Menu>
    </>
  );
}
