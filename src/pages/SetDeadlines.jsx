// pages/SetDeadlines.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DeadlineForm from '../components/DeadlineForm';
import useTechnologiesApi from '../hooks/useTechnologiesApi';

function SetDeadlines() {
    const { technologies, loading, error, updateStatus } = useTechnologiesApi();
    const [localTechnologies, setLocalTechnologies] = useState([]);

    useEffect(() => {
        if (technologies.length > 0) {
            setLocalTechnologies(technologies);
        }
    }, [technologies]);

    const handleSaveDeadlines = (deadlinesData) => {
        // Обновляем технологии с новыми дедлайнами
        const updatedTechs = localTechnologies.map(tech => ({
            ...tech,
            deadline: deadlinesData[tech.id] || tech.deadline
        }));
        
        setLocalTechnologies(updatedTechs);
        
        // Здесь можно добавить сохранение в API/localStorage
        console.log('Сохраненные дедлайны:', deadlinesData);
        
        // Сохраняем в localStorage (временное решение)
        localStorage.setItem('technologies', JSON.stringify(updatedTechs));
        
        alert('Дедлайны успешно сохранены!');
    };

    const handleCancel = () => {
        // Навигация назад или закрытие формы
        window.history.back();
    };

    if (loading) {
        return (
            <div className="page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Загрузка технологий...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page">
                <div className="error-state">
                    <h2>Ошибка</h2>
                    <p>{error}</p>
                    <Link to="/" className="btn">На главную</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1>Установка сроков изучения</h1>
                <Link to="/" className="btn btn-secondary">
                    ← На главную
                </Link>
            </div>

            <div className="page-content">
                {localTechnologies.length === 0 ? (
                    <div className="empty-state">
                        <p>Нет технологий для установки сроков</p>
                        <Link to="/" className="btn btn-primary">
                            Добавить технологии
                        </Link>
                    </div>
                ) : (
                    <DeadlineForm
                        technologies={localTechnologies}
                        onSaveDeadlines={handleSaveDeadlines}
                        onCancel={handleCancel}
                    />
                )}
            </div>
        </div>
    );
}

export default SetDeadlines;