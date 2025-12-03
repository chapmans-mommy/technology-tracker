// src/context/ThemeContext.jsx
import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from '../theme/theme';

// Создаем контекст
const ThemeContext = createContext();

// Хук для использования контекста темы
export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within ThemeProvider');
    }
    return context;
};

// Провайдер темы
export const ThemeProvider = ({ children }) => {
    // Получаем сохраненную тему из localStorage или используем светлую по умолчанию
    const [themeMode, setThemeMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme-mode');
        return savedTheme || 'light';
    });

    // Переключение темы
    const toggleTheme = () => {
        setThemeMode(prevMode => {
            const newMode = prevMode === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme-mode', newMode);
            return newMode;
        });
    };

    // Установка конкретной темы
    const setTheme = (mode) => {
        if (mode === 'light' || mode === 'dark') {
            setThemeMode(mode);
            localStorage.setItem('theme-mode', mode);
        }
    };

    // Текущая тема на основе выбранного режима
    const theme = useMemo(() => {
        return themeMode === 'light' ? lightTheme : darkTheme;
    }, [themeMode]);

    // Применяем класс темы к body для поддержки CSS переменных
    useEffect(() => {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${themeMode}-theme`);
        
        // Также добавляем атрибут data-theme для поддержки кастомных CSS
        document.body.setAttribute('data-theme', themeMode);
    }, [themeMode]);

    // Контекстное значение
    const contextValue = {
        themeMode,
        toggleTheme,
        setTheme,
        isDarkMode: themeMode === 'dark',
        isLightMode: themeMode === 'light',
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};