// components/DeadlineForm.jsx
import { useState, useEffect, useRef } from 'react';
import './DeadlineForm.css';

function DeadlineForm({ technologies, onSaveDeadlines, onCancel }) {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    
    // Для управления фокусом и доступностью
    const firstInputRef = useRef(null);
    const successMessageRef = useRef(null);

    // Инициализация формы
    useEffect(() => {
        const initialData = {};
        technologies.forEach(tech => {
            if (tech.deadline) {
                initialData[tech.id] = tech.deadline;
            }
        });
        setFormData(initialData);
        
        // Фокус на первом поле для навигации с клавиатуры
        if (firstInputRef.current) {
            firstInputRef.current.focus();
        }
    }, [technologies]);

    // Валидация в реальном времени
    const validateField = (techId, value) => {
        const newErrors = { ...errors };
        
        if (value) {
            const deadlineDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // Проверки
            if (deadlineDate < today) {
                newErrors[techId] = 'Дедлайн не может быть в прошлом';
            } else if (deadlineDate.getFullYear() > 2030) {
                newErrors[techId] = 'Слишком далекая дата (максимум 2030 год)';
            } else {
                delete newErrors[techId];
            }
        } else {
            delete newErrors[techId];
        }
        
        setErrors(newErrors);
    };

    const handleDateChange = (techId, value) => {
        const newFormData = { ...formData, [techId]: value };
        setFormData(newFormData);
        validateField(techId, value);
    };

    const handleClearDate = (techId) => {
        const newFormData = { ...formData };
        delete newFormData[techId];
        setFormData(newFormData);
        
        const newErrors = { ...errors };
        delete newErrors[techId];
        setErrors(newErrors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Проверка всех полей перед отправкой
        const finalErrors = {};
        Object.entries(formData).forEach(([techId, date]) => {
            validateField(techId, date);
        });
        
        if (Object.keys(errors).length > 0) {
            // Фокус на первом поле с ошибкой
            const firstErrorId = Object.keys(errors)[0];
            document.getElementById(`deadline-${firstErrorId}`)?.focus();
            return;
        }

        setIsSubmitting(true);
        
        try {
            // Имитация API запроса
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Вызываем callback родителя
            onSaveDeadlines(formData);
            
            setSubmitSuccess(true);
            successMessageRef.current?.focus();
            
            // Автоматическое скрытие сообщения об успехе
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 3000);
            
        } catch (error) {
            console.error('Ошибка сохранения:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Обработчик клавиатуры для доступности
    const handleKeyDown = (e, techId) => {
        // Enter на кнопке очистки
        if (e.key === 'Enter' && e.target.type === 'button') {
            handleClearDate(techId);
        }
        
        // Escape закрывает форму
        if (e.key === 'Escape' && onCancel) {
            onCancel();
        }
    };

    return (
        <div className="deadline-form-container" role="form" aria-label="Форма установки сроков изучения">
            {/* Область для объявлений скринридера */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {isSubmitting && 'Сохраняем дедлайны...'}
                {submitSuccess && 'Дедлайны успешно сохранены!'}
            </div>

            {/* Сообщение об успехе */}
            {submitSuccess && (
                <div
                    ref={successMessageRef}
                    className="success-message"
                    role="alert"
                    tabIndex={-1}
                    aria-live="assertive"
                >
                    ✅ Дедлайны успешно сохранены!
                </div>
            )}

            <form onSubmit={handleSubmit} className="deadline-form" noValidate>
                <h2>Установка сроков изучения</h2>
                <p className="form-description">
                    Установите сроки изучения для каждой технологии. Дедлайны не могут быть в прошлом.
                </p>

                <div className="technologies-list">
                    {technologies.map((tech, index) => (
                        <div key={tech.id} className="technology-row">
                            <div className="tech-info">
                                <h3 className="tech-title">{tech.title}</h3>
                                <span className={`tech-status ${tech.status}`}>
                                    {tech.status === 'completed' ? '✅ Изучено' : 
                                     tech.status === 'in-progress' ? '⏳ В процессе' : '⭕ Не начато'}
                                </span>
                            </div>
                            
                            <div className="date-field">
                                <label htmlFor={`deadline-${tech.id}`} className="date-label">
                                    Дедлайн изучения:
                                </label>
                                
                                <div className="input-group">
                                    <input
                                        id={`deadline-${tech.id}`}
                                        type="date"
                                        value={formData[tech.id] || ''}
                                        onChange={(e) => handleDateChange(tech.id, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, tech.id)}
                                        className={`date-input ${errors[tech.id] ? 'error' : ''}`}
                                        aria-required="false"
                                        aria-invalid={!!errors[tech.id]}
                                        aria-describedby={errors[tech.id] ? `error-${tech.id}` : undefined}
                                        ref={index === 0 ? firstInputRef : null}
                                        min={new Date().toISOString().split('T')[0]}
                                        max="2030-12-31"
                                    />
                                    
                                    {formData[tech.id] && (
                                        <button
                                            type="button"
                                            onClick={() => handleClearDate(tech.id)}
                                            className="clear-btn"
                                            aria-label={`Очистить дедлайн для ${tech.title}`}
                                            onKeyDown={(e) => handleKeyDown(e, tech.id)}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                                
                                {errors[tech.id] && (
                                    <div
                                        id={`error-${tech.id}`}
                                        className="error-message"
                                        role="alert"
                                        aria-live="polite"
                                    >
                                        ⚠️ {errors[tech.id]}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={isSubmitting || Object.keys(errors).length > 0}
                        aria-busy={isSubmitting}
                    >
                        {isSubmitting ? 'Сохранение...' : 'Сохранить дедлайны'}
                    </button>
                    
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn-secondary"
                        disabled={isSubmitting}
                    >
                        Отмена
                    </button>
                </div>

                <div className="form-hints">
                    <p className="hint">
                        💡 <strong>Советы:</strong> Используйте Tab для навигации, Enter для выбора даты, 
                        Escape для отмены.
                    </p>
                    <p className="hint">
                        📅 Дедлайны сохраняются автоматически при изменении.
                    </p>
                </div>
            </form>
        </div>
    );
}

export default DeadlineForm;