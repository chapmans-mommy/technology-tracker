import { useState, useEffect, useCallback } from 'react';

const initialTechnologies = [
    {
        id: 1,
        title: 'React Components',
        description: 'Изучение функциональных и классовых компонентов, работа с props и state',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    {
        id: 2,
        title: 'JSX Syntax',
        description: 'Освоение синтаксиса JSX, условного рендеринга и работы со списками',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    {
        id: 3,
        title: 'State Management',
        description: 'Работа с состоянием компонентов через useState и useEffect',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    {
        id: 4,
        title: 'React Hooks',
        description: 'Изучение встроенных хуков и создание кастомных хуков',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    {
        id: 5,
        title: 'React Router',
        description: 'Настройка маршрутизации в React-приложениях',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    }
];

let globalTechnologies = {
    data: [],
    listeners: new Set(),
    
    setData(newData) {
        this.data = newData;
        localStorage.setItem('technologies', JSON.stringify(newData));
        this.notifyListeners();
    },
    
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    },
    
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.data));
    }
};

function useTechnologiesApi() {
    const [technologies, setTechnologies] = useState(globalTechnologies.data);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadTechnologies = () => {
            try {
                setLoading(true);
                const saved = localStorage.getItem('technologies');
                
                if (saved) {
                    const parsed = JSON.parse(saved);
                    setTechnologies(parsed);
                    globalTechnologies.data = parsed;
                } else {
                    setTechnologies(initialTechnologies);
                    globalTechnologies.data = initialTechnologies;
                    localStorage.setItem('technologies', JSON.stringify(initialTechnologies));
                }
                
                setError(null);
            } catch (err) {
                console.error('Ошибка загрузки технологий:', err);
                setError('Не удалось загрузить технологии');
                setTechnologies(initialTechnologies);
                globalTechnologies.data = initialTechnologies;
            } finally {
                setLoading(false);
            }
        };

        loadTechnologies();

        const unsubscribe = globalTechnologies.subscribe((newData) => {
            setTechnologies(newData);
        });

        const handleStorageChange = (e) => {
            if (e.key === 'technologies') {
                try {
                    if (e.newValue) {
                        const parsed = JSON.parse(e.newValue);
                        setTechnologies(parsed);
                        globalTechnologies.data = parsed;
                    }
                } catch (err) {
                    console.error('Ошибка синхронизации:', err);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            unsubscribe();
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const updateStatus = useCallback((techId, newStatus) => {
        const updated = technologies.map(tech =>
            tech.id === techId ? { ...tech, status: newStatus } : tech
        );
        
        setTechnologies(updated);
        globalTechnologies.setData(updated);
    }, [technologies]);

    const bulkUpdateStatuses = useCallback((updates) => {
        const updated = technologies.map(tech => {
            const update = updates.find(u => u.id === tech.id);
            return update ? { ...tech, status: update.status } : tech;
        });
        
        setTechnologies(updated);
        globalTechnologies.setData(updated);
    }, [technologies]);

    const updateNotes = useCallback((techId, newNotes) => {
        const updated = technologies.map(tech =>
            tech.id === techId ? { ...tech, notes: newNotes } : tech
        );
        
        setTechnologies(updated);
        globalTechnologies.setData(updated);
    }, [technologies]);

    const addTechnology = useCallback((techData) => {
        const newTech = {
            id: Date.now(),
            ...techData,
            status: 'not-started',
            notes: '',
            createdAt: new Date().toISOString()
        };
        
        const updated = [...technologies, newTech];
        setTechnologies(updated);
        globalTechnologies.setData(updated);
        
        return newTech;
    }, [technologies]);

    const markAllCompleted = useCallback(() => {
        const updated = technologies.map(tech => ({ ...tech, status: 'completed' }));
        setTechnologies(updated);
        globalTechnologies.setData(updated);
    }, [technologies]);

    const resetAllStatuses = useCallback(() => {
        const updated = technologies.map(tech => ({ ...tech, status: 'not-started' }));
        setTechnologies(updated);
        globalTechnologies.setData(updated);
    }, [technologies]);

    const refetch = useCallback(() => {
        setLoading(true);
        try {
            const saved = localStorage.getItem('technologies');
            if (saved) {
                const parsed = JSON.parse(saved);
                setTechnologies(parsed);
                globalTechnologies.data = parsed;
            }
            setError(null);
        } catch (err) {
            setError('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    }, []);
    const updateDeadline = useCallback((techId, deadline) => {
        const updated = technologies.map(tech =>
            tech.id === techId ? { ...tech, deadline } : tech
        );
        
        setTechnologies(updated);
        globalTechnologies.setData(updated);
    }, [technologies]);

    return {
        technologies,
        loading,
        error,
        refetch,
        updateStatus,
        bulkUpdateStatuses,
        updateNotes,
        addTechnology,
        markAllCompleted,
        resetAllStatuses,
        updateDeadline,
    };
}

export default useTechnologiesApi;