// hooks/useTechnologiesApi.jsx
import { useState, useEffect } from 'react';

// Начальные данные
const initialTechnologies = [
  {
    id: 1,
    title: "React",
    description: "Библиотека JavaScript для создания пользовательских интерфейсов",
    category: "frontend",
    difficulty: "intermediate",
    documentationUrl: "https://react.dev",
    status: "not-started",
    notes: "",
    resources: ["https://react.dev", "https://ru.reactjs.org"]
  },
  {
    id: 2,
    title: "Node.js",
    description: "Среда выполнения JavaScript на сервере",
    category: "backend",
    difficulty: "intermediate",
    documentationUrl: "https://nodejs.org",
    status: "not-started",
    notes: "",
    resources: ["https://nodejs.org", "https://nodejs.org/ru/docs/"]
  },
  {
    id: 3,
    title: "TypeScript",
    description: "Типизированное надмножество JavaScript",
    category: "language",
    difficulty: "intermediate",
    documentationUrl: "https://www.typescriptlang.org",
    status: "not-started",
    notes: "",
    resources: ["https://www.typescriptlang.org"]
  }
];

function useTechnologiesApi() {
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Функция для получения данных из GitHub API
    const fetchGitHubData = async (techName) => {
        const techToRepo = {
            'React': 'facebook/react',
            'Node.js': 'nodejs/node',
            'TypeScript': 'microsoft/TypeScript',
            'JavaScript': 'tc39/ecma262',
            'Python': 'python/cpython',
            'Docker': 'docker/docker-ce'
        };
        
        const repoPath = techToRepo[techName];
        if (!repoPath) return null;

        try {
            const response = await fetch(`https://api.github.com/repos/${repoPath}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) return null;
            return await response.json();
        } catch (err) {
            console.warn(`GitHub API error for ${techName}:`, err.message);
            return null;
        }
    };

    // Основная функция загрузки
    const fetchTechnologies = async () => {
        try {
            setLoading(true);
            setError(null);

            // Пробуем загрузить из localStorage
            const saved = localStorage.getItem('technologies');
            let baseTechnologies = saved ? JSON.parse(saved) : initialTechnologies;

            // Обогащаем данными из GitHub API
            const enhancedTechnologies = await Promise.all(
                baseTechnologies.map(async (tech) => {
                    const githubData = await fetchGitHubData(tech.title);
                    
                    return {
                        ...tech,
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
                        resources: tech.resources || [
                            tech.documentationUrl || `https://${tech.title.toLowerCase()}.org`,
                            `https://github.com/search?q=${encodeURIComponent(tech.title)}`,
                            `https://stackoverflow.com/questions/tagged/${tech.title.toLowerCase()}`
                        ]
                    };
                })
            );

            setTechnologies(enhancedTechnologies);

        } catch (err) {
            console.error('Ошибка загрузки:', err);
            
            // Fallback на простые данные
            const saved = localStorage.getItem('technologies');
            if (saved) {
                setTechnologies(JSON.parse(saved));
            } else {
                setTechnologies(initialTechnologies);
            }
            
            setError('Используются локальные данные');
        } finally {
            setLoading(false);
        }
    };

    // Добавление новой технологии
    const addTechnology = async (techData) => {
        try {
            const newTech = {
                id: Date.now(),
                ...techData,
                status: 'not-started',
                notes: '',
                createdAt: new Date().toISOString(),
                stats: {
                    stars: 0,
                    forks: 0,
                    watchers: 0,
                    openIssues: 0,
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
            localStorage.setItem('technologies', JSON.stringify(updatedTechnologies));
            
            return newTech;

        } catch (err) {
            throw new Error(`Не удалось добавить технологию: ${err.message}`);
        }
    };

    // Загружаем при монтировании
    useEffect(() => {
        fetchTechnologies();
    }, []);

    // Остальные функции остаются как были
    const updateStatus = (techId, newStatus) => {
        const updated = technologies.map(tech =>
            tech.id === techId ? { ...tech, status: newStatus } : tech
        );
        setTechnologies(updated);
        localStorage.setItem('technologies', JSON.stringify(updated));
    };

    const updateNotes = (techId, newNotes) => {
        const updated = technologies.map(tech =>
            tech.id === techId ? { ...tech, notes: newNotes } : tech
        );
        setTechnologies(updated);
        localStorage.setItem('technologies', JSON.stringify(updated));
    };

    const markAllCompleted = () => {
        const updated = technologies.map(tech => ({ ...tech, status: 'completed' }));
        setTechnologies(updated);
        localStorage.setItem('technologies', JSON.stringify(updated));
    };

    const resetAllStatuses = () => {
        const updated = technologies.map(tech => ({ ...tech, status: 'not-started' }));
        setTechnologies(updated);
        localStorage.setItem('technologies', JSON.stringify(updated));
    };

    const updateDeadlines = (deadlinesData) => {
        const updatedTechnologies = technologies.map(tech => ({
            ...tech,
            deadline: deadlinesData[tech.id] || tech.deadline
        }));
        setTechnologies(updatedTechnologies);
        localStorage.setItem('technologies', JSON.stringify(updatedTechnologies));
    };

    return {
        technologies,
        loading,
        error,
        refetch: fetchTechnologies,
        addTechnology,
        updateStatus,
        updateNotes,
        markAllCompleted,
        resetAllStatuses,
        updateDeadlines
    };
}

export default useTechnologiesApi;