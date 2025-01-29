'use client';

import { useState } from 'react';
import {
  Badge,
  Box,
  IconButton,
  Popover,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  alpha,
  useTheme,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BuildIcon from '@mui/icons-material/Build';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningIcon from '@mui/icons-material/Warning';

// Mock notifications data
const notifications = [
  {
    id: 1,
    type: 'inspection',
    title: 'New Inspection Due',
    message: 'Equipment #156 requires inspection by tomorrow',
    time: '2 hours ago',
    icon: <AssignmentIcon />,
    color: '#3b82f6',
  },
  {
    id: 2,
    type: 'maintenance',
    title: 'Maintenance Alert',
    message: 'Scheduled maintenance for Sprayer #23',
    time: '5 hours ago',
    icon: <BuildIcon />,
    color: '#f59e0b',
  },
  {
    id: 3,
    type: 'alert',
    title: 'Critical Alert',
    message: 'Equipment #89 reported abnormal readings',
    time: '1 day ago',
    icon: <WarningIcon />,
    color: '#ef4444',
  },
];

export default function NotificationsPopover() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{ color: 'text.primary' }}
      >
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 360,
            maxHeight: 480,
            overflowY: 'auto',
            boxShadow: theme.customShadows.dropdown,
          },
        }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You have {notifications.length} new notifications
          </Typography>
        </Box>

        <Divider />

        <List sx={{ p: 0 }}>
          {notifications.map((notification, index) => (
            <Box key={notification.id}>
              <ListItem
                sx={{
                  py: 2,
                  px: 2.5,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                    cursor: 'pointer',
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: `${notification.color}15`,
                      color: notification.color,
                    }}
                  >
                    {notification.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notification.title}
                  secondary={
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{ mb: 0.5 }}
                      >
                        {notification.message}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.disabled' }}
                      >
                        {notification.time}
                      </Typography>
                    </Box>
                  }
                  primaryTypographyProps={{
                    variant: 'subtitle2',
                    sx: { mb: 0.25 },
                  }}
                />
              </ListItem>
              {index < notifications.length - 1 && (
                <Divider sx={{ mx: 2 }} />
              )}
            </Box>
          ))}
        </List>
      </Popover>
    </>
  );
}
