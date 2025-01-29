'use client';

import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as CustomThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { getTheme } from '@/theme/theme';
import AppLayout from './layout/AppLayout';
import { useState, useEffect } from 'react';

function ThemedContent({ children }: { children: React.ReactNode }) {
  const { mode } = useTheme();
  const theme = getTheme(mode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by rendering a loader or nothing
  if (!mounted) {
    return null;
  }

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      <AppLayout>{children}</AppLayout>
    </MUIThemeProvider>
  );
}

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <CustomThemeProvider>
      <ThemedContent>{children}</ThemedContent>
    </CustomThemeProvider>
  );
}
