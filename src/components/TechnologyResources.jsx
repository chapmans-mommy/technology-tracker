// components/TechnologyResources.jsx
import { useState, useEffect } from 'react';
import './TechnologyResources.css';

function TechnologyResources({ technology, onClose }) {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Загружаем ресурсы из внешнего API или используем локальные
    const fetchResources = async () => {
        try {
            setLoading(true);
            setError(null);

            // Если у технологии уже есть ресурсы в данных, используем их
            if (technology.resources && technology.resources.length > 0) {
                // Преобразуем строки ресурсов в объекты
                const resourceObjects = technology.resources.map((url, index) => ({
                    id: index + 1,
                    url: url,
                    title: `Ресурс ${index + 1}`,
                    type: getResourceType(url)
                }));
                setResources(resourceObjects);
                setLoading(false);
                return;
            }

            // Иначе загружаем из внешнего API (пример для GitHub API)
            if (technology.title.toLowerCase().includes('react')) {
                // Пример запроса к GitHub API для React
                const response = await fetch('https://api.github.com/repos/facebook/react', {
                    signal: AbortSignal.timeout(5000)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const githubData = await response.json();

                // Формируем ресурсы на основе данных API
                const apiResources = [
                    {
                        id: 1,
                        title: 'Официальный сайт',
                        url: 'https://react.dev',
                        type: 'website',
                        description: 'Документация React'
                    },
                    {
                        id: 2,
                        title: 'GitHub репозиторий',
                        url: githubData.html_url,
                        type: 'github',
                        description: `⭐ Звёзд: ${githubData.stargazers_count}`,
                        stars: githubData.stargazers_count
                    },
                    {
                        id: 3,
                        title: 'Документация (рус)',
                        url: 'https://ru.reactjs.org',
                        type: 'documentation',
                        description: 'Русскоязычная документация'
                    }
                ];

                setResources(apiResources);
            } else if (technology.title.toLowerCase().includes('node')) {
                // Ресурсы для Node.js
                const nodeResources = [
                    {
                        id: 1,
                        title: 'Официальный сайт',
                        url: 'https://nodejs.org',
                        type: 'website',
                        description: 'Документация Node.js'
                    },
                    {
                        id: 2,
                        title: 'npm',
                        url: 'https://www.npmjs.com',
                        type: 'package-manager',
                        description: 'Менеджер пакетов'
                    },
                    {
                        id: 3,
                        title: 'Документация (рус)',
                        url: 'https://nodejs.org/ru/docs/',
                        type: 'documentation',
                        description: 'Русскоязычная документация'
                    }
                ];
                setResources(nodeResources);
            } else {
                // Общие ресурсы для других технологий
                const generalResources = [
                    {
                        id: 1,
                        title: 'Поиск документации',
                        url: `https://www.google.com/search?q=${encodeURIComponent(technology.title + ' документация')}`,
                        type: 'search',
                        description: 'Поиск в Google'
                    },
                    {
                        id: 2,
                        title: 'YouTube уроки',
                        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(technology.title + ' tutorial')}`,
                        type: 'video',
                        description: 'Видео уроки'
                    },
                    {
                        id: 3,
                        title: 'Stack Overflow',
                        url: `https://stackoverflow.com/questions/tagged/${technology.title.toLowerCase()}`,
                        type: 'forum',
                        description: 'Вопросы и ответы'
                    }
                ];
                setResources(generalResources);
            }

        } catch (err) {
            if (err.name !== 'AbortError') {
                setError(`Ошибка загрузки ресурсов: ${err.message}`);
                console.error('Ошибка загрузки ресурсов:', err);
            }
        } finally {
            setLoading(false);
        }
    };

    // Определяем тип ресурса по URL
    const getResourceType = (url) => {
        if (url.includes('github.com')) return 'github';
        if (url.includes('npmjs.com')) return 'npm';
        if (url.includes('youtube.com') || url.includes('youtu.be')) return 'video';
        if (url.includes('stackoverflow.com')) return 'forum';
        if (url.includes('docs') || url.includes('documentation')) return 'documentation';
        return 'website';
    };

    // Загружаем ресурсы при монтировании
    useEffect(() => {
        fetchResources();
    }, [technology]);

    const getIconForType = (type) => {
        switch (type) {
            case 'github': return '🐙';
            case 'npm': return '📦';
            case 'video': return '🎬';
            case 'forum': return '💬';
            case 'documentation': return '📚';
            case 'search': return '🔍';
            default: return '🌐';
        }
    };

    return (
        <div className="technology-resources">
            <div className="resources-header">
                <h3>📚 Ресурсы по "{technology.title}"</h3>
                <button onClick={onClose} className="close-btn">✕</button>
            </div>

            {loading && (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Загрузка ресурсов...</p>
                </div>
            )}

            {error && (
                <div className="error-state">
                    <p>⚠️ {error}</p>
                    <button onClick={fetchResources} className="retry-btn">
                        Попробовать снова
                    </button>
                </div>
            )}

            {!loading && !error && resources.length > 0 ? (
                <div className="resources-list">
                    {resources.map(resource => (
                        <a
                            key={resource.id}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resource-item"
                        >
                            <div className="resource-icon">
                                {getIconForType(resource.type)}
                            </div>
                            <div className="resource-content">
                                <h4>{resource.title}</h4>
                                <p className="resource-description">
                                    {resource.description || resource.url}
                                </p>
                                <span className="resource-url">
                                    {resource.url.length > 50 
                                        ? resource.url.substring(0, 50) + '...' 
                                        : resource.url}
                                </span>
                                {resource.stars && (
                                    <div className="resource-stats">
                                        <span className="stars">⭐ {resource.stars}</span>
                                    </div>
                                )}
                            </div>
                            <div className="resource-arrow">↗</div>
                        </a>
                    ))}
                </div>
            ) : (
                !loading && !error && (
                    <div className="no-resources">
                        <p>😕 Ресурсы не найдены</p>
                        <button onClick={fetchResources} className="search-btn">
                            Поискать в интернете
                        </button>
                    </div>
                )
            )}

            <div className="resources-footer">
                <p>Все ссылки открываются в новой вкладке</p>
            </div>
        </div>
    );
}

export default TechnologyResources;