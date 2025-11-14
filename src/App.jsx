import { useState } from 'react';
import './App.css';
import useTechnologies from './hooks/useTechnologies';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';

function App() {
  const { 
    technologies, 
    updateStatus, 
    updateNotes, 
    markAllCompleted, 
    resetAllStatuses, 
    progress 
  } = useTechnologies();
  
  // Состояние для активного фильтра
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Состояние для поискового запроса
  const [searchQuery, setSearchQuery] = useState('');

  // Функция для случайного выбора технологии
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

  // Фильтрация технологий по статусу
  const filteredByStatus = technologies.filter(tech => {
    switch (activeFilter) {
      case 'completed':
        return tech.status === 'completed';
      case 'in-progress':
        return tech.status === 'in-progress';
      case 'not-started':
        return tech.status === 'not-started';
      default:
        return true; // 'all'
    }
  });

  // Фильтрация технологий по поисковому запросу
  const filteredTechnologies = filteredByStatus.filter(tech =>
    tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="App">
      <header className="app-header">
        <h1>Трекер изучения технологий</h1>
        <p>Отслеживайте ваш прогресс в изучении React и связанных технологий</p>
      </header>

      {/* Компонент прогресса */}
      <ProgressHeader technologies={technologies} />

      {/* Быстрые действия */}
      <QuickActions
        technologies={technologies}
        onMarkAllCompleted={markAllCompleted}
        onResetAll={resetAllStatuses}
        onRandomSelect={handleRandomSelect}
      />

      {/* Поиск */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Поиск технологий..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span>Найдено: {filteredTechnologies.length}</span>
      </div>

      {/* Фильтры */}
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

      {/* Список технологий */}
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
    </div>
  );
}

export default App;