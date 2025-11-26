import { useState, useEffect } from 'react';

function useTechnologiesApi() {
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTechnologies = async () => {
        try {
            setLoading(true);
            setError(null);

            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockTechnologies = [
                {
                    id: 1,
                    title: 'React',
                    description: 'Библиотека для создания пользовательских интерфейсов',
                    category: 'frontend',
                    difficulty: 'beginner',
                    status: 'not-started',
                    notes: '',
                    resources: ['https://react.dev', 'https://ru.reactjs.org']
                },
                {
                    id: 2,
                    title: 'Node.js',
                    description: 'Среда выполнения JavaScript на сервере',
                    category: 'backend',
                    difficulty: 'intermediate',
                    status: 'not-started',
                    notes: '',
                    resources: ['https://nodejs.org', 'https://nodejs.org/ru/docs/']
                },
                {
                    id: 3,
                    title: 'TypeScript',
                    description: 'Типизированное надмножество JavaScript',
                    category: 'language',
                    difficulty: 'intermediate',
                    status: 'not-started',
                    notes: '',
                    resources: ['https://www.typescriptlang.org']
                },
                {
                    id: 4,
                    title: 'MongoDB',
                    description: 'Документоориентированная система управления базами данных',
                    category: 'database',
                    difficulty: 'intermediate',
                    status: 'not-started',
                    notes: '',
                    resources: ['https://www.mongodb.com']
                },
                {
                    id: 5,
                    title: 'Docker',
                    description: 'Платформа для контейнеризации приложений',
                    category: 'devops',
                    difficulty: 'advanced',
                    status: 'not-started',
                    notes: '',
                    resources: ['https://www.docker.com']
                }
            ];

            localStorage.setItem('technologies', JSON.stringify(mockTechnologies));
            setTechnologies(mockTechnologies);

        } catch (err) {
            setError('Не удалось загрузить технологии');
            console.error('Ошибка загрузки:', err);
        } finally {
            setLoading(false);
        }
    };

    const addTechnology = async (techData) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const newTech = {
                id: Date.now(), 
                ...techData,
                status: 'not-started',
                notes: '',
                createdAt: new Date().toISOString()
            };

            const updatedTechnologies = [...technologies, newTech];
            setTechnologies(updatedTechnologies);
            
            localStorage.setItem('technologies', JSON.stringify(updatedTechnologies));
            
            return newTech;

        } catch (err) {
            throw new Error('Не удалось добавить технологию');
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

    const updateAllStatuses = (newStatus) => {
        const updatedTechnologies = technologies.map(tech => ({
            ...tech,
            status: newStatus
        }));
        setTechnologies(updatedTechnologies);
        localStorage.setItem('technologies', JSON.stringify(updatedTechnologies));
    };

    const markAllCompleted = () => {
        updateAllStatuses('completed');
    };

    const resetAllStatuses = () => {
        updateAllStatuses('not-started');
    };

    useEffect(() => {
        const saved = localStorage.getItem('technologies');
        if (saved) {
            const savedTechnologies = JSON.parse(saved);
            setTechnologies(savedTechnologies);
            setLoading(false);
        } else {
            fetchTechnologies();
        }
    }, []);

    return {
        technologies,
        loading,
        error,
        refetch: fetchTechnologies,
        addTechnology,
        updateStatus,
        updateNotes,
        markAllCompleted,  
        resetAllStatuses   
    };
}

export default useTechnologiesApi;