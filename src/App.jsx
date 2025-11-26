import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import useTechnologies from './hooks/useTechnologies';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import Navigation from './components/Navigation';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';

function App() {
  const { 
    technologies, 
    updateStatus, 
    updateNotes, 
    markAllCompleted, 
    resetAllStatuses, 
    progress 
  } = useTechnologies();
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
                <p>Отслеживайте ваш прогресс в изучении React и связанных технологий</p>
              </header>

              <ProgressHeader technologies={technologies} />

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