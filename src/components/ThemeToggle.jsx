// src/components/ThemeToggle.jsx
import React from 'react';
import {
    IconButton,
    Tooltip,
    Switch,
    FormControlLabel,
    Box,
    useTheme
} from '@mui/material';
import {
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
    BrightnessAuto as AutoModeIcon
} from '@mui/icons-material';
import { useThemeContext } from '../context/ThemeContext';

// Вариант 1: Иконка-кнопка (для навигации)
export const ThemeToggleButton = ({ size = 'medium', sx = {} }) => {
    const { themeMode, toggleTheme } = useThemeContext();
    const theme = useTheme();

    return (
        <Tooltip title={themeMode === 'light' ? 'Темная тема' : 'Светлая тема'}>
            <IconButton
                onClick={toggleTheme}
                size={size}
                sx={{
                    color: 'inherit',
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    },
                    ...sx,
                }}
                aria-label="Переключить тему"
            >
                {themeMode === 'light' ? (
                    <DarkModeIcon />
                ) : (
                    <LightModeIcon />
                )}
            </IconButton>
        </Tooltip>
    );
};

// Вариант 2: Переключатель (для настроек)
export const ThemeToggleSwitch = ({ label = "Темная тема", sx = {} }) => {
    const { themeMode, toggleTheme } = useThemeContext();

    return (
        <FormControlLabel
            control={
                <Switch
                    checked={themeMode === 'dark'}
                    onChange={toggleTheme}
                    color="primary"
                />
            }
            label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {themeMode === 'light' ? (
                        <LightModeIcon fontSize="small" />
                    ) : (
                        <DarkModeIcon fontSize="small" />
                    )}
                    <span>{label}</span>
                </Box>
            }
            sx={sx}
        />
    );
};

// Вариант 3: Расширенный переключатель с тремя состояниями
export const ThemeSelector = () => {
    const { themeMode, setTheme } = useThemeContext();
    const theme = useTheme();

    const themes = [
        { mode: 'light', label: 'Светлая', icon: <LightModeIcon /> },
        { mode: 'dark', label: 'Темная', icon: <DarkModeIcon /> },
        // Можно добавить auto mode в будущем
    ];

    return (
        <Box sx={{ display: 'flex', gap: 1 }}>
            {themes.map((themeOption) => (
                <Tooltip key={themeOption.mode} title={themeOption.label}>
                    <IconButton
                        onClick={() => setTheme(themeOption.mode)}
                        sx={{
                            color: themeMode === themeOption.mode 
                                ? theme.palette.primary.main 
                                : theme.palette.text.secondary,
                            backgroundColor: themeMode === themeOption.mode 
                                ? theme.palette.action.selected 
                                : 'transparent',
                            '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                            },
                        }}
                        aria-label={themeOption.label}
                    >
                        {themeOption.icon}
                    </IconButton>
                </Tooltip>
            ))}
        </Box>
    );
};

// Экспорт по умолчанию для удобства
export default ThemeToggleButton;