// src/components/NotificationSystem.jsx
import React from 'react';
import {
    Snackbar,
    Alert,
    IconButton,
    Slide
} from '@mui/material';
import {
    Close as CloseIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Warning as WarningIcon,
    Info as InfoIcon
} from '@mui/icons-material';

// Компонент для плавного появления/исчезновения
function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
}

// Иконки для разных типов уведомлений
const alertIcons = {
    success: <CheckCircleIcon fontSize="inherit" />,
    error: <ErrorIcon fontSize="inherit" />,
    warning: <WarningIcon fontSize="inherit" />,
    info: <InfoIcon fontSize="inherit" />,
};

// Компонент системы уведомлений
function NotificationSystem({ 
    notifications, 
    onClose, 
    position = { vertical: 'bottom', horizontal: 'left' },
    autoHideDuration = 6000 
}) {
    const { vertical, horizontal } = position;
    
    // Обработчик закрытия уведомления
    const handleClose = (id, reason) => {
        if (reason === 'clickaway') {
            return; // Не закрываем при клике вне области
        }
        onClose(id);
    };

    // Функция для получения цвета в зависимости от типа
    const getSeverity = (type) => {
        switch (type) {
            case 'success': return 'success';
            case 'error': return 'error';
            case 'warning': return 'warning';
            case 'info': return 'info';
            default: return 'info';
        }
    };

    return (
        <>
            {notifications.map((notification) => (
                <Snackbar
                    key={notification.id}
                    anchorOrigin={{ vertical, horizontal }}
                    open={true}
                    autoHideDuration={notification.duration || autoHideDuration}
                    onClose={(event, reason) => handleClose(notification.id, reason)}
                    TransitionComponent={SlideTransition}
                    sx={{
                        '& .MuiSnackbarContent-root': {
                            flexWrap: 'nowrap',
                        }
                    }}
                >
                    <Alert
                        severity={getSeverity(notification.type)}
                        variant="filled"
                        icon={alertIcons[notification.type]}
                        sx={{
                            width: '100%',
                            maxWidth: {
                                xs: '300px',  // Мобильные
                                sm: '400px',  // Планшеты
                                md: '500px'   // Десктоп
                            },
                            alignItems: 'center',
                            '& .MuiAlert-message': {
                                flex: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }
                        }}
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => handleClose(notification.id)}
                                sx={{ ml: 1 }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                    >
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            gap: '4px'
                        }}>
                            {notification.title && (
                                <strong style={{ fontSize: '1.1em' }}>
                                    {notification.title}
                                </strong>
                            )}
                            <span>{notification.message}</span>
                            {notification.action && (
                                <div style={{ marginTop: '8px' }}>
                                    {notification.action}
                                </div>
                            )}
                        </div>
                    </Alert>
                </Snackbar>
            ))}
        </>
    );
}

export default NotificationSystem;