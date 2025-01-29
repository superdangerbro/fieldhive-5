import { createTheme, alpha, Theme } from '@mui/material/styles';

// Custom theme extension
declare module '@mui/material/styles' {
  interface Theme {
    customShadows: {
      card: string;
      dialog: string;
      dropdown: string;
    };
    customBorderRadius: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
    };
  }
  interface ThemeOptions {
    customShadows?: {
      card?: string;
      dialog?: string;
      dropdown?: string;
    };
    customBorderRadius?: {
      xs?: number;
      sm?: number;
      md?: number;
      lg?: number;
    };
  }
}

const baseTheme = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  customBorderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          borderRadius: theme.customBorderRadius.md,
          backgroundImage: 'none',
        }),
      },
    },
  },
};

export const getTheme = (mode: 'light' | 'dark') => {
  const isDark = mode === 'dark';
  
  return createTheme({
    ...baseTheme,
    palette: {
      mode,
      primary: {
        main: '#3b82f6',
        light: '#60a5fa',
        dark: '#2563eb',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#6366f1',
        light: '#818cf8',
        dark: '#4f46e5',
      },
      background: {
        default: isDark ? '#0f172a' : '#f8fafc',
        paper: isDark ? '#1e293b' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f1f5f9' : '#0f172a',
        secondary: isDark ? '#cbd5e1' : '#475569',
      },
      error: {
        main: '#ef4444',
      },
      warning: {
        main: '#f59e0b',
      },
      success: {
        main: '#10b981',
      },
      info: {
        main: '#3b82f6',
      },
    },
    customShadows: {
      card: isDark
        ? '0 2px 4px -1px rgba(0,0,0,0.2)'
        : '0 2px 4px -1px rgba(0,0,0,0.06)',
      dialog: isDark
        ? '0 25px 50px -12px rgba(0,0,0,0.25)'
        : '0 25px 50px -12px rgba(0,0,0,0.1)',
      dropdown: isDark
        ? '0 4px 6px -1px rgba(0,0,0,0.2)'
        : '0 4px 6px -1px rgba(0,0,0,0.06)',
    },
  });
};
