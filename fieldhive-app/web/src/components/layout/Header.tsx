'use client';

import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ProfileMenu from './ProfileMenu';
import ThemeToggle from '../common/ThemeToggle';
import NotificationsPopover from '../common/NotificationsPopover';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 'none',
        backdropFilter: 'blur(6px)',
        backgroundColor: alpha(theme.palette.background.default, 0.8),
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        color: theme.palette.text.primary,
      }}
    >
      <Toolbar>
        <IconButton
          onClick={onMenuClick}
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            display: { xs: 'none', sm: 'block' },
          }}
        >
          FieldHive
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <ThemeToggle />
          <NotificationsPopover />
          <ProfileMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
