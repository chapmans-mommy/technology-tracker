import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import useTechnologiesApi from './hooks/useTechnologiesApi'; 
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import Navigation from './components/Navigation';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import RoadmapImporter from './components/RoadmapImporter';

function App() {
    const { 
        technologies, 
        loading, 
        error, 
        refetch,
        updateStatus, 
        addTechnology,
        updateNotes, 
        markAllCompleted, 
        resetAllStatuses
    } = useTechnologiesApi(); 
    
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

  
    const handleImportTechnologies = (importedTechs) => {
        importedTechs.forEach(tech => {
            addTechnology(tech);
        });
    };

    const handleRandomSelect = () => {
        const notStartedTechs = technologies.filter(tech => tech.status === 'not-started');
        if (notStartedTechs.length > 0) {
            const randomTech = notStartedTechs[Math.floor(Math.random() * notStartedTechs.length)];
            updateStatus(randomTech.id, 'in-progress');
            alert(`Следующая технология для изучения: ${randomTech.title}`);
        } else {
            alert('Все технологии уже начаты или завершены!');
        }
    };

    if (loading) {
        return (
            <div className="app-loading">
                <div className="spinner"></div>
                <p>Загрузка технологий...</p>
            </div>
        );
    }

    const filteredByStatus = technologies.filter(tech => {
        switch (activeFilter) {
            case 'completed':
                return tech.status === 'completed';
            case 'in-progress':
                return tech.status === 'in-progress';
            case 'not-started':
                return tech.status === 'not-started';
            default:
                return true;
        }
    });

    const filteredTechnologies = filteredByStatus.filter(tech =>
        tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Router>
            <div className="App">
                <Navigation />
                
                <Routes>
                    {/* Главная страница */}
                    <Route path="/" element={
                        <>
                            <header className="app-header">
                                <h1>Трекер изучения технологий</h1>
                                <p>Отслеживайте ваш прогресс в изучении современных технологий</p>
                                {/* Добавляем кнопку обновления согласно ТЗ */}
                                <button onClick={refetch} className="refresh-btn">
                                    Обновить
                                </button>
                            </header>

                            {/* Добавляем обработку ошибок согласно ТЗ */}
                            {error && (
                                <div className="app-error">
                                    <p>❌ {error}</p>
                                    <button onClick={refetch}>Попробовать снова</button>
                                </div>
                            )}

                            <ProgressHeader technologies={technologies} />

                            {/* Добавляем компонент импорта дорожных карт согласно ТЗ */}
                            <RoadmapImporter onImport={handleImportTechnologies} />

                            <QuickActions
                                technologies={technologies}
                                onMarkAllCompleted={markAllCompleted}
                                onResetAll={resetAllStatuses}
                                onRandomSelect={handleRandomSelect}
                            />

                            <div className="search-box">
                                <input
                                    type="text"
                                    placeholder="Поиск технологий..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <span>Найдено: {filteredTechnologies.length}</span>
                            </div>

                            <div className="filters">
                                <h3>Фильтры:</h3>
                                <div className="filter-buttons">
                                    <button 
                                        className={activeFilter === 'all' ? 'active' : ''}
                                        onClick={() => setActiveFilter('all')}
                                    >
                                        Все ({technologies.length})
                                    </button>
                                    <button 
                                        className={activeFilter === 'not-started' ? 'active' : ''}
                                        onClick={() => setActiveFilter('not-started')}
                                    >
                                        Не начаты ({technologies.filter(t => t.status === 'not-started').length})
                                    </button>
                                    <button 
                                        className={activeFilter === 'in-progress' ? 'active' : ''}
                                        onClick={() => setActiveFilter('in-progress')}
                                    >
                                        В процессе ({technologies.filter(t => t.status === 'in-progress').length})
                                    </button>
                                    <button 
                                        className={activeFilter === 'completed' ? 'active' : ''}
                                        onClick={() => setActiveFilter('completed')}
                                    >
                                        Изучено ({technologies.filter(t => t.status === 'completed').length})
                                    </button>
                                </div>
                            </div>

                            <main className="technologies-list">
                                <h2>Дорожная карта изучения ({filteredTechnologies.length})</h2>
                                {filteredTechnologies.map(tech => (
                                    <TechnologyCard
                                        key={tech.id}
                                        technology={tech}
                                        onStatusChange={updateStatus}
                                        onNotesChange={updateNotes}
                                    />
                                ))}
                                {filteredTechnologies.length === 0 && (
                                    <div className="empty-state">
                                        <p>Нет технологий, соответствующих выбранному фильтру</p>
                                    </div>
                                )}
                            </main>
                        </>
                    } />

                    {/* Страница всех технологий */}
                    <Route path="/technologies" element={<TechnologyList />} />
                    
                    {/* Страница деталей технологии */}
                    <Route path="/technology/:techId" element={<TechnologyDetail />} />
                    
                    {/* Страница статистики */}
                    <Route path="/statistics" element={<Statistics />} />
                    
                    {/* Страница настроек */}
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;