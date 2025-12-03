// pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
    Switch,
    Button,
    Alert,
    Chip,
    FormControlLabel
} from '@mui/material';
import {
    Palette as PaletteIcon,
    Notifications as NotificationsIcon,
    Backup as BackupIcon,
    Info as InfoIcon,
    ArrowBack as ArrowBackIcon,
    Download as DownloadIcon,
    Upload as UploadIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useThemeContext } from '../context/ThemeContext';
import { ThemeToggleSwitch } from '../components/ThemeToggle';

function Settings() {
    const [settings, setSettings] = useState({
        notifications: true,
        autoSave: true,
        compactView: false
    });

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const { themeMode } = useThemeContext();

    useEffect(() => {
        const savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const handleSettingChange = (key, value) => {
        const newSettings = {
            ...settings,
            [key]: value
        };
        setSettings(newSettings);
        localStorage.setItem('appSettings', JSON.stringify(newSettings));
    };

    const showMessage = (message) => {
        setAlertMessage(message);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    const handleExportData = () => {
        try {
            const technologies = localStorage.getItem('technologies');
            const settings = localStorage.getItem('appSettings');
            
            const exportData = {
                technologies: technologies ? JSON.parse(technologies) : [],
                settings: settings ? JSON.parse(settings) : {},
                exportDate: new Date().toISOString()
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `tech-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            showMessage('Данные успешно экспортированы!');
        } catch (error) {
            showMessage('Ошибка при экспорте данных');
        }
    };

    const handleImportData = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    
                    if (importData.technologies) {
                        localStorage.setItem('technologies', JSON.stringify(importData.technologies));
                    }
                    
                    if (importData.settings) {
                        localStorage.setItem('appSettings', JSON.stringify(importData.settings));
                        setSettings(importData.settings);
                    }
                    
                    showMessage('Данные успешно импортированы!');
                    setTimeout(() => window.location.reload(), 1000);
                } catch (error) {
                    showMessage('Ошибка при импорте данных');
                }
            };
            reader.readAsText(file);
        }
    };

    const handleClearData = () => {
        if (window.confirm('Вы уверены, что хотите удалить все данные?')) {
            localStorage.removeItem('technologies');
            showMessage('Все данные удалены');
            setTimeout(() => window.location.reload(), 1000);
        }
    };

    const handleResetSettings = () => {
        if (window.confirm('Сбросить все настройки?')) {
            const defaultSettings = {
                notifications: true,
                autoSave: true,
                compactView: false
            };
            setSettings(defaultSettings);
            localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
            showMessage('Настройки сброшены');
        }
    };

    // Статистика
    const technologies = JSON.parse(localStorage.getItem('technologies') || '[]');

    return (
        <div className="page">
            <div className="page-header">
                <Typography variant="h4" component="h1">
                    Настройки
                </Typography>
                <Link to="/">
                    <Button startIcon={<ArrowBackIcon />} variant="outlined">
                        На главную
                    </Button>
                </Link>
            </div>

            {showAlert && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    {alertMessage}
                </Alert>
            )}

            <Box sx={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Статистика */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Статистика
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip label={`Всего: ${technologies.length}`} />
                            <Chip 
                                label={`Изучено: ${technologies.filter(t => t.status === 'completed').length}`} 
                                color="success" 
                                variant="outlined" 
                            />
                            <Chip 
                                label={`В процессе: ${technologies.filter(t => t.status === 'in-progress').length}`} 
                                color="warning" 
                                variant="outlined" 
                            />
                        </Box>
                    </CardContent>
                </Card>

                {/* Внешний вид */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PaletteIcon />
                            Внешний вид
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <ThemeToggleSwitch 
                                label={`Темная тема (сейчас: ${themeMode === 'light' ? 'светлая' : 'темная'})`} 
                            />
                            
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.compactView}
                                        onChange={(e) => handleSettingChange('compactView', e.target.checked)}
                                    />
                                }
                                label="Компактный вид"
                            />
                        </Box>
                    </CardContent>
                </Card>

                {/* Уведомления */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <NotificationsIcon />
                            Уведомления
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.notifications}
                                        onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                                    />
                                }
                                label="Показывать уведомления"
                            />
                            
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.autoSave}
                                        onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                                    />
                                }
                                label="Автосохранение"
                            />
                        </Box>
                    </CardContent>
                </Card>

                {/* Управление данными */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BackupIcon />
                            Данные
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button 
                                variant="contained" 
                                startIcon={<DownloadIcon />}
                                onClick={handleExportData}
                                fullWidth
                            >
                                Экспорт данных
                            </Button>
                            
                            <Button 
                                variant="outlined" 
                                component="label"
                                startIcon={<UploadIcon />}
                                fullWidth
                            >
                                Импорт данных
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleImportData}
                                    hidden
                                />
                            </Button>
                            
                            <Button 
                                variant="outlined" 
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={handleClearData}
                                fullWidth
                            >
                                Очистить все данные
                            </Button>
                            
                            <Button 
                                variant="outlined" 
                                onClick={handleResetSettings}
                                fullWidth
                            >
                                Сбросить настройки
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {/* Информация */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InfoIcon />
                            О приложении
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Typography variant="body2">
                                <strong>Версия:</strong> 1.0.0
                            </Typography>
                            <Typography variant="body2">
                                <strong>Технологий:</strong> {technologies.length}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Тема:</strong> {themeMode === 'light' ? 'Светлая' : 'Темная'}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </div>
    );
}

export default Settings;