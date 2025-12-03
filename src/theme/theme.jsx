// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

// Светлая тема
export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#6366f1', // фиолетовый
            light: '#818cf8',
            dark: '#4f46e5',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#10b981', // зеленый
            light: '#34d399',
            dark: '#059669',
            contrastText: '#ffffff',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
        text: {
            primary: '#1f2937',
            secondary: '#6b7280',
        },
        success: {
            main: '#10b981',
            light: '#34d399',
            dark: '#059669',
        },
        warning: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
        },
        error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
        },
        info: {
            main: '#3b82f6',
            light: '#60a5fa',
            dark: '#2563eb',
        },
        divider: '#e5e7eb',
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
        },
        h2: {
            fontWeight: 600,
            fontSize: '2rem',
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
        },
        h6: {
            fontWeight: 600,
            fontSize: '1rem',
        },
    },
    shape: {
        borderRadius: 12,
    },
    shadows: [
        'none',
        '0 1px 3px rgba(0,0,0,0.12)',
        '0 2px 8px rgba(0,0,0,0.1)',
        '0 4px 16px rgba(0,0,0,0.08)',
        '0 8px 24px rgba(0,0,0,0.06)',
        '0 16px 32px rgba(0,0,0,0.04)',
        '0 32px 64px rgba(0,0,0,0.02)',
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                },
            },
        },
    },
});

// Темная тема
export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#818cf8', // светлый фиолетовый
            light: '#a5b4fc',
            dark: '#6366f1',
            contrastText: '#1f2937',
        },
        secondary: {
            main: '#34d399', // светлый зеленый
            light: '#6ee7b7',
            dark: '#10b981',
            contrastText: '#1f2937',
        },
        background: {
            default: '#111827',
            paper: '#1f2937',
        },
        text: {
            primary: '#f9fafb',
            secondary: '#d1d5db',
        },
        success: {
            main: '#34d399',
            light: '#6ee7b7',
            dark: '#10b981',
        },
        warning: {
            main: '#fbbf24',
            light: '#fcd34d',
            dark: '#f59e0b',
        },
        error: {
            main: '#f87171',
            light: '#fca5a5',
            dark: '#ef4444',
        },
        info: {
            main: '#60a5fa',
            light: '#93c5fd',
            dark: '#3b82f6',
        },
        divider: '#374151',
    },
    typography: {
        ...lightTheme.typography,
    },
    shape: {
        borderRadius: 12,
    },
    shadows: [
        'none',
        '0 1px 3px rgba(0,0,0,0.24)',
        '0 2px 8px rgba(0,0,0,0.2)',
        '0 4px 16px rgba(0,0,0,0.16)',
        '0 8px 24px rgba(0,0,0,0.12)',
        '0 16px 32px rgba(0,0,0,0.08)',
        '0 32px 64px rgba(0,0,0,0.04)',
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                },
            },
        },
    },
});

// Экспортируем обе темы
export const themes = {
    light: lightTheme,
    dark: darkTheme,
};

export default themes;