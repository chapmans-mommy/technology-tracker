// src/context/NotificationContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';

// Создаем контекст
const NotificationContext = createContext();

// Функция для генерации ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Провайдер контекста
export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    // Показать уведомление
    const showNotification = useCallback((notification) => {
        const id = generateId();
        const newNotification = {
            id,
            type: 'info',
            duration: 6000,
            ...notification
        };

        setNotifications(prev => [...prev, newNotification]);

        // Автоматическое закрытие
        if (newNotification.duration !== 0) {
            setTimeout(() => {
                removeNotification(id);
            }, newNotification.duration);
        }

        return id;
    }, []);

    // Удалить уведомление
    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, []);

    // Очистить все уведомления
    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    // Хелперы для разных типов уведомлений
    const showSuccess = useCallback((message, options = {}) => {
        return showNotification({
            type: 'success',
            message,
            ...options
        });
    }, [showNotification]);

    const showError = useCallback((message, options = {}) => {
        return showNotification({
            type: 'error',
            message,
            ...options
        });
    }, [showNotification]);

    const showWarning = useCallback((message, options = {}) => {
        return showNotification({
            type: 'warning',
            message,
            ...options
        });
    }, [showNotification]);

    const showInfo = useCallback((message, options = {}) => {
        return showNotification({
            type: 'info',
            message,
            ...options
        });
    }, [showNotification]);

    const value = {
        notifications,
        showNotification,
        removeNotification,
        clearNotifications,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}

// Хук для использования контекста
export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
}