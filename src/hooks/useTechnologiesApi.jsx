import { useState, useEffect } from 'react';

function useTechnologiesApi() {
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Загрузка технологий из API
    const fetchTechnologies = async () => {
        try {
            setLoading(true);
            setError(null);

            // В реальном приложении здесь будет запрос к вашему API
            // Сейчас имитируем загрузку с задержкой
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Мок данные - в реальном приложении замените на реальный API
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

            // Сохраняем в localStorage для совместимости с существующим кодом
            localStorage.setItem('technologies', JSON.stringify(mockTechnologies));
            setTechnologies(mockTechnologies);

        } catch (err) {
            setError('Не удалось загрузить технологии');
            console.error('Ошибка загрузки:', err);
        } finally {
            setLoading(false);
        }
    };

    // Добавление новой технологии
    const addTechnology = async (techData) => {
        try {
            // Имитация API запроса
            await new Promise(resolve => setTimeout(resolve, 500));

            const newTech = {
                id: Date.now(), // В реальном приложении ID генерируется на сервере
                ...techData,
                status: 'not-started',
                notes: '',
                createdAt: new Date().toISOString()
            };

            const updatedTechnologies = [...technologies, newTech];
            setTechnologies(updatedTechnologies);
            
            // Сохраняем в localStorage для совместимости
            localStorage.setItem('technologies', JSON.stringify(updatedTechnologies));
            
            return newTech;

        } catch (err) {
            throw new Error('Не удалось добавить технологию');
        }
    };

    // Обновление статуса технологии
    const updateStatus = (techId, newStatus) => {
        const updatedTechnologies = technologies.map(tech =>
            tech.id === techId ? { ...tech, status: newStatus } : tech
        );
        setTechnologies(updatedTechnologies);
        localStorage.setItem('technologies', JSON.stringify(updatedTechnologies));
    };

    // Обновление заметок технологии
    const updateNotes = (techId, newNotes) => {
        const updatedTechnologies = technologies.map(tech =>
            tech.id === techId ? { ...tech, notes: newNotes } : tech
        );
        setTechnologies(updatedTechnologies);
        localStorage.setItem('technologies', JSON.stringify(updatedTechnologies));
    };

    // Загружаем технологии при монтировании
    useEffect(() => {
        // Сначала проверяем localStorage для обратной совместимости
        const saved = localStorage.getItem('technologies');
        if (saved) {
            const savedTechnologies = JSON.parse(saved);
            setTechnologies(savedTechnologies);
            setLoading(false);
        } else {
            // Если в localStorage нет данных, загружаем из API
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
        updateNotes
    };
}

export default useTechnologiesApi;