// AddTechnology.jsx
import React, { useState } from 'react';
import './AddTechnology.css';

function AddTechnology({ onAddTechnology }) {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'frontend',
        priority: 'medium',
        deadline: '',
        notes: ''
    });
    const [errors, setErrors] = useState({});

    const categories = [
        { value: 'frontend', label: 'Frontend' },
        { value: 'backend', label: 'Backend' },
        { value: 'database', label: 'База данных' },
        { value: 'devops', label: 'DevOps' },
        { value: 'mobile', label: 'Мобильная разработка' },
        { value: 'testing', label: 'Тестирование' },
        { value: 'tools', label: 'Инструменты' },
        { value: 'other', label: 'Другое' }
    ];

    const priorities = [
        { value: 'low', label: 'Низкий', color: '#10b981' },
        { value: 'medium', label: 'Средний', color: '#f59e0b' },
        { value: 'high', label: 'Высокий', color: '#ef4444' }
    ];

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.title.trim()) {
            newErrors.title = 'Название обязательно';
        } else if (formData.title.trim().length < 2) {
            newErrors.title = 'Название должно содержать минимум 2 символа';
        }
        
        if (!formData.description.trim()) {
            newErrors.description = 'Описание обязательно';
        } else if (formData.description.trim().length < 10) {
            newErrors.description = 'Описание должно содержать минимум 10 символов';
        }
        
        if (formData.deadline) {
            const deadlineDate = new Date(formData.deadline);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (deadlineDate < today) {
                newErrors.deadline = 'Дедлайн не может быть в прошлом';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const newTechnology = {
            id: Date.now().toString(),
            title: formData.title.trim(),
            description: formData.description.trim(),
            category: formData.category,
            priority: formData.priority,
            status: 'not-started',
            createdAt: new Date().toISOString(),
            deadline: formData.deadline || null,
            notes: formData.notes.trim() || '',
            resources: []
        };
        
        onAddTechnology(newTechnology);
        
        // Сброс формы
        setFormData({
            title: '',
            description: '',
            category: 'frontend',
            priority: 'medium',
            deadline: '',
            notes: ''
        });
        setErrors({});
        setShowForm(false);
        
        // Показываем уведомление об успехе
        alert('✅ Технология успешно добавлена!');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Очищаем ошибку при изменении поля
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleCancel = () => {
        setFormData({
            title: '',
            description: '',
            category: 'frontend',
            priority: 'medium',
            deadline: '',
            notes: ''
        });
        setErrors({});
        setShowForm(false);
    };

    return (
        <div className="add-technology">
            {!showForm ? (
                <button 
                    className="add-tech-toggle-btn"
                    onClick={() => setShowForm(true)}
                >
                    <span className="plus-icon">+</span>
                    Добавить технологию
                </button>
            ) : (
                <div className="add-tech-form-container">
                    <div className="add-tech-header">
                        <h3>Добавить новую технологию</h3>
                        <button 
                            className="close-form-btn"
                            onClick={handleCancel}
                        >
                            ×
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="add-tech-form">
                        <div className="form-group">
                            <label htmlFor="title">
                                Название технологии *
                                {errors.title && (
                                    <span className="error-text"> {errors.title}</span>
                                )}
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Например: React, Docker, PostgreSQL"
                                className={errors.title ? 'error' : ''}
                                autoFocus
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="description">
                                Описание *
                                {errors.description && (
                                    <span className="error-text"> {errors.description}</span>
                                )}
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Опишите, что это за технология и зачем её изучать"
                                rows="4"
                                className={errors.description ? 'error' : ''}
                            />
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="category">Категория</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    {categories.map(cat => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="priority">Приоритет</label>
                                <select
                                    id="priority"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                >
                                    {priorities.map(pri => (
                                        <option key={pri.value} value={pri.value}>
                                            {pri.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="deadline">
                                    Дедлайн (необязательно)
                                    {errors.deadline && (
                                        <span className="error-text"> {errors.deadline}</span>
                                    )}
                                </label>
                                <input
                                    type="date"
                                    id="deadline"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    className={errors.deadline ? 'error' : ''}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="notes">Заметки (необязательно)</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Дополнительные заметки"
                                    rows="2"
                                />
                            </div>
                        </div>
                        
                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={handleCancel}
                            >
                                Отмена
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                            >
                                Добавить технологию
                            </button>
                        </div>
                        
                        <div className="form-help">
                            <p>* — обязательные поля</p>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default AddTechnology;