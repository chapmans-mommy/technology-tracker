// pages/Settings.js
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Settings() {
    const [settings, setSettings] = useState({
        theme: 'light',
        language: 'ru',
        notifications: true,
        autoSave: true
    });

    useEffect(() => {
        // Загрузка настроек из localStorage
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

    const handleExportData = () => {
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
                    
                    alert('Данные успешно импортированы!');
                    window.location.reload();
                } catch (error) {
                    alert('Ошибка при импорте данных: неверный формат файла');
                }
            };
            reader.readAsText(file);
        }
    };

    const handleClearData = () => {
        if (window.confirm('Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.')) {
            localStorage.removeItem('technologies');
            alert('Все данные удалены');
            window.location.reload();
        }
    };

    const handleResetSettings = () => {
        if (window.confirm('Сбросить все настройки к значениям по умолчанию?')) {
            const defaultSettings = {
                theme: 'light',
                language: 'ru',
                notifications: true,
                autoSave: true
            };
            setSettings(defaultSettings);
            localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Настройки приложения</h1>
                <Link to="/" className="btn">
                    ← На главную
                </Link>
            </div>

            <div className="settings-container">
                {/* Внешний вид */}
                <div className="settings-section">
                    <h3>Внешний вид</h3>
                    <div className="setting-item">
                        <label>Тема оформления:</label>
                        <select 
                            value={settings.theme}
                            onChange={(e) => handleSettingChange('theme', e.target.value)}
                        >
                            <option value="light">Светлая</option>
                            <option value="dark">Темная</option>
                            <option value="auto">Системная</option>
                        </select>
                    </div>
                    
                    <div className="setting-item">
                        <label>Язык:</label>
                        <select 
                            value={settings.language}
                            onChange={(e) => handleSettingChange('language', e.target.value)}
                        >
                            <option value="ru">Русский</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                </div>

                {/* Уведомления */}
                <div className="settings-section">
                    <h3>Уведомления</h3>
                    <div className="setting-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={settings.notifications}
                                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                            />
                            Включить уведомления
                        </label>
                    </div>
                    
                    <div className="setting-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={settings.autoSave}
                                onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                            />
                            Автосохранение
                        </label>
                    </div>
                </div>

                {/* Управление данными */}
                <div className="settings-section">
                    <h3>Управление данными</h3>
                    <div className="setting-actions">
                        <button onClick={handleExportData} className="btn btn-primary">
                            Экспорт данных
                        </button>
                        
                        <label className="btn btn-secondary">
                            Импорт данных
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImportData}
                                style={{ display: 'none' }}
                            />
                        </label>
                        
                        <button onClick={handleClearData} className="btn btn-danger">
                            Очистить все данные
                        </button>
                    </div>
                </div>

                {/* Сброс настроек */}
                <div className="settings-section">
                    <h3>Сброс настроек</h3>
                    <button onClick={handleResetSettings} className="btn btn-warning">
                        Сбросить настройки по умолчанию
                    </button>
                </div>

                {/* Информация о приложении */}
                <div className="settings-section">
                    <h3>О приложении</h3>
                    <div className="app-info">
                        <p><strong>Версия:</strong> 1.0.0</p>
                        <p><strong>Разработчик:</strong> Трекер технологий</p>
                        <p><strong>Дата сборки:</strong> {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;