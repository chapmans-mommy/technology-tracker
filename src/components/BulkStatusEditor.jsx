// components/BulkStatusEditor.jsx
import { useState, useEffect, useRef } from 'react';
import './BulkStatusEditor.css';

function BulkStatusEditor({ technologies, onUpdateStatuses, onClose }) {
    // Состояния
    const [selectedIds, setSelectedIds] = useState([]);
    const [newStatus, setNewStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [actionConfirmed, setActionConfirmed] = useState(false);
    
    // Рефы для доступности
    const mainHeadingRef = useRef(null);
    const selectAllCheckboxRef = useRef(null);
    const statusSelectRef = useRef(null);
    const applyButtonRef = useRef(null);
    const successMessageRef = useRef(null);

    // Инициализация
    useEffect(() => {
        // Фокус на заголовке при монтировании
        mainHeadingRef.current?.focus();
        
        // Установка начального статуса
        if (!newStatus) {
            setNewStatus('in-progress');
        }
    }, []);

    // Обработчики выбора
    const toggleSelectAll = () => {
        if (selectedIds.length === technologies.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(technologies.map(tech => tech.id));
        }
    };

    const toggleTechnology = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) 
                ? prev.filter(techId => techId !== id)
                : [...prev, id]
        );
    };

    // Валидация
    const validateForm = () => {
        const newErrors = {};
        
        if (selectedIds.length === 0) {
            newErrors.selected = 'Выберите хотя бы одну технологию';
        }
        
        if (!newStatus) {
            newErrors.status = 'Выберите новый статус';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Применение изменений
    const handleApplyChanges = async () => {
        if (!validateForm()) {
            // Фокус на первом поле с ошибкой
            if (errors.selected) {
                selectAllCheckboxRef.current?.focus();
            } else if (errors.status) {
                statusSelectRef.current?.focus();
            }
            return;
        }

        // Подтверждение для массовых операций
        if (!actionConfirmed && selectedIds.length > 3) {
            const confirmed = window.confirm(
                `Вы собираетесь изменить статус ${selectedIds.length} технологий. Продолжить?`
            );
            if (!confirmed) return;
            setActionConfirmed(true);
        }

        setIsSubmitting(true);

        try {
            // Имитация API запроса
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Применяем изменения
            const updates = selectedIds.map(id => ({
                id,
                status: newStatus
            }));
            
            onUpdateStatuses(updates);
            
            // Показываем успех и фокус на сообщении
            successMessageRef.current?.focus();
            
            // Автоочистка через 3 секунды
            setTimeout(() => {
                setSelectedIds([]);
                setIsSubmitting(false);
                setActionConfirmed(false);
            }, 3000);

        } catch (error) {
            console.error('Ошибка обновления:', error);
            setErrors({ submit: 'Ошибка при сохранении изменений' });
            setIsSubmitting(false);
        }
    };

    // Обработчики клавиатуры
    const handleKeyDown = (e, action) => {
        switch (e.key) {
            case 'Escape':
                if (onClose) onClose();
                break;
            case 'Enter':
                if (action === 'apply' && !isSubmitting) {
                    handleApplyChanges();
                }
                break;
            case ' ':
                if (action === 'toggleAll') {
                    e.preventDefault();
                    toggleSelectAll();
                }
                break;
        }
    };

    // Получение текста статуса
    const getStatusText = (status) => {
        const statusMap = {
            'not-started': 'Не начато',
            'in-progress': 'В процессе',
            'completed': 'Завершено'
        };
        return statusMap[status] || status;
    };

    // Получение цвета статуса
    const getStatusColor = (status) => {
        const colorMap = {
            'not-started': '#6b7280',
            'in-progress': '#f59e0b',
            'completed': '#10b981'
        };
        return colorMap[status] || '#6b7280';
    };

    return (
        <div 
            className="bulk-status-editor"
            role="dialog"
            aria-labelledby="bulk-edit-title"
            aria-describedby="bulk-edit-description"
        >
            {/* Область для скринридера */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {isSubmitting && `Изменяем статусы ${selectedIds.length} технологий...`}
            </div>

            {/* Заголовок */}
            <div className="editor-header">
                <h2 
                    id="bulk-edit-title" 
                    ref={mainHeadingRef}
                    tabIndex={-1}
                >
                    ⚡ Массовое редактирование статусов
                </h2>
                <p id="bulk-edit-description" className="description">
                    Выберите технологии и установите для них новый статус
                </p>
                
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="close-btn"
                        aria-label="Закрыть редактор"
                        disabled={isSubmitting}
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Сообщение об успехе */}
            {isSubmitting && selectedIds.length > 0 && (
                <div 
                    ref={successMessageRef}
                    className="success-message"
                    role="alert"
                    aria-live="assertive"
                    tabIndex={-1}
                >
                    ✅ Успешно обновлено {selectedIds.length} технологий
                </div>
            )}

            {/* Ошибки */}
            {errors.submit && (
                <div className="error-message" role="alert">
                    ⚠️ {errors.submit}
                </div>
            )}

            {/* Основной контент */}
            <div className="editor-content">
                {/* Панель управления */}
                <div className="control-panel">
                    <div className="selection-controls">
                        <label className="select-all-label">
                            <input
                                ref={selectAllCheckboxRef}
                                type="checkbox"
                                checked={selectedIds.length === technologies.length && technologies.length > 0}
                                onChange={toggleSelectAll}
                                onKeyDown={(e) => handleKeyDown(e, 'toggleAll')}
                                aria-label="Выбрать все технологии"
                                disabled={technologies.length === 0 || isSubmitting}
                            />
                            <span className="select-all-text">
                                Выбрать все ({selectedIds.length}/{technologies.length})
                            </span>
                        </label>
                        
                        {errors.selected && (
                            <span className="field-error" role="alert">
                                {errors.selected}
                            </span>
                        )}
                    </div>

                    <div className="status-controls">
                        <label htmlFor="new-status-select" className="status-label">
                            Новый статус:
                        </label>
                        <select
                            id="new-status-select"
                            ref={statusSelectRef}
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className={`status-select ${errors.status ? 'error' : ''}`}
                            aria-required="true"
                            aria-invalid={!!errors.status}
                            aria-describedby={errors.status ? "status-error" : undefined}
                            disabled={isSubmitting}
                        >
                            <option value="">-- Выберите статус --</option>
                            <option value="not-started">⭕ Не начато</option>
                            <option value="in-progress">⏳ В процессе</option>
                            <option value="completed">✅ Завершено</option>
                        </select>
                        
                        {errors.status && (
                            <span id="status-error" className="field-error" role="alert">
                                {errors.status}
                            </span>
                        )}
                    </div>

                    <div className="action-controls">
                        <button
                            ref={applyButtonRef}
                            type="button"
                            onClick={handleApplyChanges}
                            className="apply-btn"
                            disabled={isSubmitting || selectedIds.length === 0 || !newStatus}
                            aria-busy={isSubmitting}
                            onKeyDown={(e) => handleKeyDown(e, 'apply')}
                        >
                            {isSubmitting ? 'Применяем...' : `Применить к ${selectedIds.length} элементам`}
                        </button>
                    </div>
                </div>

                {/* Список технологий */}
                <div className="technologies-grid" role="list">
                    {technologies.length === 0 ? (
                        <div className="empty-state">
                            <p>Нет технологий для редактирования</p>
                        </div>
                    ) : (
                        technologies.map(tech => {
                            const isSelected = selectedIds.includes(tech.id);
                            return (
                                <div 
                                    key={tech.id}
                                    className={`technology-card ${isSelected ? 'selected' : ''}`}
                                    role="listitem"
                                    aria-selected={isSelected}
                                >
                                    <div className="card-header">
                                        <input
                                            type="checkbox"
                                            id={`tech-${tech.id}`}
                                            checked={isSelected}
                                            onChange={() => toggleTechnology(tech.id)}
                                            aria-labelledby={`tech-title-${tech.id}`}
                                            disabled={isSubmitting}
                                        />
                                        <h3 
                                            id={`tech-title-${tech.id}`}
                                            className="tech-title"
                                        >
                                            {tech.title}
                                        </h3>
                                    </div>
                                    
                                    <div className="card-body">
                                        <p className="tech-description">
                                            {tech.description}
                                        </p>
                                        
                                        <div className="tech-meta">
                                            <span 
                                                className="current-status"
                                                style={{ 
                                                    backgroundColor: `${getStatusColor(tech.status)}20`,
                                                    color: getStatusColor(tech.status)
                                                }}
                                            >
                                                {getStatusText(tech.status)}
                                            </span>
                                            <span className="tech-category">
                                                {tech.category}
                                            </span>
                                        </div>
                                        
                                        {tech.deadline && (
                                            <div className="tech-deadline">
                                                📅 Дедлайн: {new Date(tech.deadline).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {isSelected && (
                                        <div className="selection-indicator" aria-hidden="true">
                                            ✓ Выбрано
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Подсказки по доступности */}
            <div className="accessibility-hints" role="note">
                <h4>💡 Советы по использованию:</h4>
                <ul>
                    <li>Используйте <kbd>Tab</kbd> для навигации между элементами</li>
                    <li>Нажмите <kbd>Пробел</kbd> на чекбоксе для выбора</li>
                    <li><kbd>Enter</kbd> применяет изменения</li>
                    <li><kbd>Escape</kbd> закрывает редактор</li>
                </ul>
            </div>

            
        </div>
    );
}

export default BulkStatusEditor;