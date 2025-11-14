import { useState } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';

function App() {
  // Состояние для технологий
  const [technologies, setTechnologies] = useState([
    {
      id: 1,
      title: 'React Components',
      description: 'Изучение функциональных и классовых компонентов, работа с props и state',
      status: 'not-started'
    },
    {
      id: 2,
      title: 'JSX Syntax',
      description: 'Освоение синтаксиса JSX, условного рендеринга и работы со списками',
      status: 'not-started'
    },
    {
      id: 3,
      title: 'State Management',
      description: 'Работа с состоянием компонентов через useState и useEffect',
      status: 'not-started'
    },
    {
      id: 4,
      title: 'React Hooks',
      description: 'Изучение встроенных хуков и создание кастомных хуков',
      status: 'not-started'
    },
    {
      id: 5,
      title: 'React Router',
      description: 'Настройка маршрутизации в React-приложениях',
      status: 'not-started'
    }
  ]);

  // Состояние для активного фильтра
  const [activeFilter, setActiveFilter] = useState('all');

  // Функция для изменения статуса технологии
  const handleStatusChange = (id, newStatus) => {
    setTechnologies(prev => 
      prev.map(tech => 
        tech.id === id ? { ...tech, status: newStatus } : tech
      )
    );
  };

  // Функция для отметки всех как выполненных
  const handleMarkAllCompleted = () => {
    setTechnologies(prev => 
      prev.map(tech => ({ ...tech, status: 'completed' }))
    );
  };

  // Функция для сброса всех статусов
  const handleResetAll = () => {
    setTechnologies(prev => 
      prev.map(tech => ({ ...tech, status: 'not-started' }))
    );
  };

  // Функция для случайного выбора технологии
  const handleRandomSelect = () => {
    const notStartedTechs = technologies.filter(tech => tech.status === 'not-started');
    if (notStartedTechs.length > 0) {
      const randomTech = notStartedTechs[Math.floor(Math.random() * notStartedTechs.length)];
      handleStatusChange(randomTech.id, 'in-progress');
      alert(`Следующая технология для изучения: ${randomTech.title}`);
    } else {
      alert('Все технологии уже начаты или завершены!');
    }
  };

  // Фильтрация технологий
  const filteredTechnologies = technologies.filter(tech => {
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
        onMarkAllCompleted={handleMarkAllCompleted}
        onResetAll={handleResetAll}
        onRandomSelect={handleRandomSelect}
      />

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
            onStatusChange={handleStatusChange}
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