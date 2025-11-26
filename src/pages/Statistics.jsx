// pages/Statistics.js
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Statistics() {
    const [technologies, setTechnologies] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        notStarted: 0,
        inProgress: 0,
        completed: 0
    });

    useEffect(() => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            const techData = JSON.parse(saved);
            setTechnologies(techData);
            
            // Расчет статистики
            const total = techData.length;
            const notStarted = techData.filter(tech => tech.status === 'not-started').length;
            const inProgress = techData.filter(tech => tech.status === 'in-progress').length;
            const completed = techData.filter(tech => tech.status === 'completed').length;
            
            setStats({
                total,
                notStarted,
                inProgress,
                completed
            });
        }
    }, []);

    const calculatePercentage = (count) => {
        return stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Статистика прогресса</h1>
                <Link to="/technologies" className="btn">
                    ← К списку технологий
                </Link>
            </div>

            <div className="stats-container">
                {/* Общая статистика */}
                <div className="stats-overview">
                    <div className="stat-card">
                        <h3>Всего технологий</h3>
                        <div className="stat-number">{stats.total}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Не начато</h3>
                        <div className="stat-number">{stats.notStarted}</div>
                        <div className="stat-percentage">{calculatePercentage(stats.notStarted)}%</div>
                    </div>
                    <div className="stat-card">
                        <h3>В процессе</h3>
                        <div className="stat-number">{stats.inProgress}</div>
                        <div className="stat-percentage">{calculatePercentage(stats.inProgress)}%</div>
                    </div>
                    <div className="stat-card">
                        <h3>Завершено</h3>
                        <div className="stat-number">{stats.completed}</div>
                        <div className="stat-percentage">{calculatePercentage(stats.completed)}%</div>
                    </div>
                </div>

                {/* График прогресса */}
                <div className="progress-chart">
                    <h3>Прогресс изучения</h3>
                    <div className="chart-bar">
                        <div 
                            className="chart-segment completed"
                            style={{ width: `${calculatePercentage(stats.completed)}%` }}
                            title={`Завершено: ${stats.completed} (${calculatePercentage(stats.completed)}%)`}
                        >
                            <span>Завершено</span>
                        </div>
                        <div 
                            className="chart-segment in-progress"
                            style={{ width: `${calculatePercentage(stats.inProgress)}%` }}
                            title={`В процессе: ${stats.inProgress} (${calculatePercentage(stats.inProgress)}%)`}
                        >
                            <span>В процессе</span>
                        </div>
                        <div 
                            className="chart-segment not-started"
                            style={{ width: `${calculatePercentage(stats.notStarted)}%` }}
                            title={`Не начато: ${stats.notStarted} (${calculatePercentage(stats.notStarted)}%)`}
                        >
                            <span>Не начато</span>
                        </div>
                    </div>
                    <div className="chart-legend">
                        <div className="legend-item">
                            <div className="legend-color completed"></div>
                            <span>Завершено ({stats.completed})</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color in-progress"></div>
                            <span>В процессе ({stats.inProgress})</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color not-started"></div>
                            <span>Не начато ({stats.notStarted})</span>
                        </div>
                    </div>
                </div>

                {/* Детализация по технологиям */}
                <div className="technologies-detail">
                    <h3>Детализация по технологиям</h3>
                    {technologies.length > 0 ? (
                        <div className="tech-stats-list">
                            {technologies.map(tech => (
                                <div key={tech.id} className="tech-stat-item">
                                    <div className="tech-info">
                                        <h4>{tech.title}</h4>
                                        <span className={`status status-${tech.status}`}>
                                            {tech.status}
                                        </span>
                                    </div>
                                    <div className="tech-progress">
                                        <div className={`progress-bar ${tech.status}`}>
                                            <div className={`progress-fill ${tech.status}`}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Нет данных для отображения</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Statistics;