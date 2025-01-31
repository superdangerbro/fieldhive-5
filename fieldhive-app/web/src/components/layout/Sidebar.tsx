/**
 * Sidebar Navigation Component
 * 
 * A responsive sidebar that displays the main navigation menu.
 * Shows different menu items based on user's role.
 * 
 * Features:
 * - Persistent drawer on desktop
 * - Collapsible nested menu items
 * - Highlights active route
 * - Custom styling for menu items
 * 
 * @param {Object} props Component props
 * @param {boolean} props.open Whether the sidebar is open
 * @param {() => void} props.onClose Callback when the sidebar should close
 * @param {number} props.width Width of the sidebar in pixels
 * @param {MenuItem[]} props.menuItems Array of menu items to display
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
} from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

interface MenuItem {
  text: string;
  href: string;
  icon: React.ReactNode;
  children?: MenuItem[];
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  width: number;
  menuItems: MenuItem[];
}

export default function Sidebar({ open, onClose, width, menuItems }: SidebarProps) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const handleMenuClick = (text: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [text]: !prev[text],
    }));
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const isSelected = pathname === item.href;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus[item.text];

    return (
      <Box key={item.text}>
        <ListItem disablePadding>
          <ListItemButton
            component={hasChildren ? 'div' : Link}
            href={hasChildren ? undefined : item.href}
            selected={isSelected}
            onClick={hasChildren ? () => handleMenuClick(item.text) : undefined}
            sx={{ pl: depth * 2 + 2 }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
            {hasChildren && (isOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>
        
        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map(child => renderMenuItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant="persistent"
      sx={{
        width: open ? width : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Image
          src="/logo.svg"
          alt="FieldHive Logo"
          width={32}
          height={32}
          priority
        />
        <Typography variant="h6" sx={{ ml: 2 }}>
          FieldHive
        </Typography>
      </Box>

      <List>
        {menuItems.map(item => renderMenuItem(item))}
      </List>
    </Drawer>
  );
}
