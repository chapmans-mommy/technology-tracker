// hooks/useTechnologiesApi.jsx
import { useState, useEffect } from 'react';

// Базовые URL для API
const GITHUB_API_BASE = 'https://api.github.com/repos';
const STACKOVERFLOW_API_BASE = 'https://api.stackexchange.com/2.3';

// Маппинг технологий на GitHub репозитории
const TECH_TO_GITHUB_REPO = {
  'React': 'facebook/react',
  'Vue.js': 'vuejs/vue',
  'Angular': 'angular/angular',
  'Node.js': 'nodejs/node',
  'Express.js': 'expressjs/express',
  'TypeScript': 'microsoft/TypeScript',
  'JavaScript': 'tc39/ecma262',
  'Python': 'python/cpython',
  'Django': 'django/django',
  'Flask': 'pallets/flask',
  'MongoDB': 'mongodb/mongo',
  'PostgreSQL': 'postgres/postgres',
  'Docker': 'docker/docker-ce',
  'Kubernetes': 'kubernetes/kubernetes',
  'Next.js': 'vercel/next.js',
  'NestJS': 'nestjs/nest',
  'GraphQL': 'graphql/graphql-js',
  'Webpack': 'webpack/webpack',
  'Babel': 'babel/babel',
  'ESLint': 'eslint/eslint'
};

function useTechnologiesApi() {
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [apiStats, setApiStats] = useState({});

    // Функция для получения данных из GitHub API
    const fetchGitHubData = async (techName) => {
        const repoPath = TECH_TO_GITHUB_REPO[techName];
        if (!repoPath) return null;

        try {
            const response = await fetch(`${GITHUB_API_BASE}/${repoPath}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            return await response.json();
        } catch (err) {
            console.warn(`Не удалось получить данные GitHub для ${techName}:`, err.message);
            return null;
        }
    };

    // Функция для получения данных из StackOverflow
    const fetchStackOverflowData = async (techName) => {
        try {
            const response = await fetch(
                `${STACKOVERFLOW_API_BASE}/questions?` +
                `order=desc&sort=activity&tagged=${encodeURIComponent(techName.toLowerCase())}&site=stackoverflow`,
                {
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`StackOverflow API error: ${response.status}`);
            }

            const data = await response.json();
            return {
                questionCount: data.total || 0,
                recentQuestions: data.items?.slice(0, 5) || []
            };
        } catch (err) {
            console.warn(`Не удалось получить данные StackOverflow для ${techName}:`, err.message);
            return null;
        }
    };

    // Загрузка технологий из API с реальными данными
    const fetchTechnologies = async () => {
        try {
            setLoading(true);
            setError(null);

            // 1. Сначала загружаем базовый список технологий из нашего JSON API
            const baseResponse = await fetch('/api/technologies.json');
            if (!baseResponse.ok) {
                throw new Error(`Ошибка загрузки базовых данных: ${baseResponse.status}`);
            }

            const baseTechnologies = await baseResponse.json();

            // 2. Для каждой технологии загружаем дополнительные данные из внешних API
            const enhancedTechnologies = await Promise.all(
                baseTechnologies.map(async (tech) => {
                    const [githubData, stackOverflowData] = await Promise.allSettled([
                        fetchGitHubData(tech.title),
                        fetchStackOverflowData(tech.title)
                    ]);

                    const apiData = {
                        github: githubData.status === 'fulfilled' ? githubData.value : null,
                        stackoverflow: stackOverflowData.status === 'fulfilled' ? stackOverflowData.value : null
                    };

                    // Сохраняем статистику API
                    setApiStats(prev => ({
                        ...prev,
                        [tech.id]: apiData
                    }));

                    // Формируем ресурсы на основе полученных данных
                    const resources = [
                        tech.documentationUrl || `https://${tech.title.toLowerCase()}.org`,
                        `https://github.com/search?q=${encodeURIComponent(tech.title)}`,
                        `https://stackoverflow.com/questions/tagged/${tech.title.toLowerCase()}`
                    ];

                    // Добавляем GitHub URL если есть данные
                    if (apiData.github) {
                        resources.unshift(apiData.github.html_url);
                    }

                    return {
                        ...tech,
                        resources,
                        apiData,
                        stats: {
                            stars: apiData.github?.stargazers_count || 0,
                            forks: apiData.github?.forks_count || 0,
                            watchers: apiData.github?.watchers_count || 0,
                            openIssues: apiData.github?.open_issues_count || 0,
                            stackOverflowQuestions: apiData.stackoverflow?.questionCount || 0
                        }
                    };
                })
            );

            setTechnologies(enhancedTechnologies);
            
            // Сохраняем в localStorage как кэш
            localStorage.setItem('technologies_cache', JSON.stringify({
                data: enhancedTechnologies,
                timestamp: Date.now()
            }));

        } catch (err) {
            console.error('Ошибка загрузки технологий:', err);
            
            // Пробуем загрузить из кэша при ошибке
            const cached = localStorage.getItem('technologies_cache');
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                // Используем кэш, если он не старше 1 часа
                if (Date.now() - timestamp < 3600000) {
                    setTechnologies(data);
                    setError('Используются кэшированные данные. Невозможно подключиться к API.');
                } else {
                    setError(`Не удалось загрузить технологии: ${err.message}`);
                }
            } else {
                setError(`Не удалось загрузить технологии: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // Добавление новой технологии с проверкой через API
    const addTechnology = async (techData) => {
        try {
            setLoading(true);

            // Проверяем существование технологии через GitHub API
            const githubData = await fetchGitHubData(techData.title);
            
            const newTech = {
                id: Date.now(),
                ...techData,
                createdAt: new Date().toISOString(),
                status: 'not-started',
                notes: '',
                apiData: {
                    github: githubData
                },
                stats: {
                    stars: githubData?.stargazers_count || 0,
                    forks: githubData?.forks_count || 0,
                    watchers: githubData?.watchers_count || 0,
                    openIssues: githubData?.open_issues_count || 0,
                    stackOverflowQuestions: 0
                },
                resources: [
                    `https://github.com/search?q=${encodeURIComponent(techData.title)}`,
                    `https://stackoverflow.com/questions/tagged/${techData.title.toLowerCase()}`,
                    `https://www.google.com/search?q=${encodeURIComponent(techData.title + ' документация')}`
                ]
            };

            const updatedTechnologies = [...technologies, newTech];
            setTechnologies(updatedTechnologies);
            
            // Обновляем localStorage
            localStorage.setItem('technologies', JSON.stringify(updatedTechnologies));
            
            return newTech;

        } catch (err) {
            throw new Error(`Не удалось добавить технологию: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = (techId, newStatus) => {
        const updatedTechnologies = technologies.map(tech =>
            tech.id === techId ? { ...tech, status: newStatus } : tech
        );
        setTechnologies(updatedTechnologies);
        localStorage.setItem('technologies', JSON.stringify(updatedTechnologies));
    };

    const updateNotes = (techId, newNotes) => {
        const updatedTechnologies = technologies.map(tech =>
            tech.id === techId ? { ...tech, notes: newNotes } : tech
        );
        setTechnologies(updatedTechnologies);
        localStorage.setItem('technologies', JSON.stringify(updatedTechnologies));
    };

    // Загружаем технологии при монтировании
    useEffect(() => {
        // Сначала проверяем, есть ли сохраненные данные
        const saved = localStorage.getItem('technologies');
        if (saved) {
            const savedTechnologies = JSON.parse(saved);
            setTechnologies(savedTechnologies);
            
            // Загружаем свежие данные из API в фоне
            fetchTechnologies();
        } else {
            // Если нет сохраненных данных, загружаем из API
            fetchTechnologies();
        }
    }, []);

    return {
        technologies,
        loading,
        error,
        apiStats,
        refetch: fetchTechnologies,
        addTechnology,
        updateStatus,
        updateNotes,
        markAllCompleted: () => {
            const updated = technologies.map(tech => ({ ...tech, status: 'completed' }));
            setTechnologies(updated);
            localStorage.setItem('technologies', JSON.stringify(updated));
        },
        resetAllStatuses: () => {
            const updated = technologies.map(tech => ({ ...tech, status: 'not-started' }));
            setTechnologies(updated);
            localStorage.setItem('technologies', JSON.stringify(updated));
        }
    };
}

export default useTechnologiesApi;