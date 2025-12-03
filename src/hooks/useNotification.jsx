// src/hooks/useNotification.js
import { useNotifications } from '../context/NotificationContext';

// Кастомный хук для удобного использования уведомлений
function useNotification() {
    const {
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showNotification,
        removeNotification,
        clearNotifications
    } = useNotifications();

    return {
        // Основные методы
        success: showSuccess,
        error: showError,
        warning: showWarning,
        info: showInfo,
        show: showNotification,
        remove: removeNotification,
        clear: clearNotifications,
        
        // Короткие алиасы
        success: showSuccess,
        error: showError,
        warn: showWarning,
        info: showInfo
    };
}

export default useNotification;