// src/App.jsx
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';

function App() {
  // Тестовые данные
  const technologies = [
    { 
      id: 1, 
      title: 'React Components', 
      description: 'Изучение функциональных и классовых компонентов, работа с props и state', 
      status: 'completed' 
    },
    { 
      id: 2, 
      title: 'JSX Syntax', 
      description: 'Освоение синтаксиса JSX, условного рендеринга и работы со списками', 
      status: 'in-progress' 
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
  ];

  return (
    <div className="App">
      <header className="app-header">
        <h1>🚀 Трекер изучения технологий</h1>
        <p>Отслеживайте ваш прогресс в изучении React и связанных технологий</p>
      </header>

      {/* Компонент прогресса */}
      <ProgressHeader technologies={technologies} />

      {/* Список технологий */}
      <main className="technologies-list">
        <h2>Дорожная карта изучения</h2>
        {technologies.map(tech => (
          <TechnologyCard
            key={tech.id}
            title={tech.title}
            description={tech.description}
            status={tech.status}
          />
        ))}
      </main>
    </div>
  );
}

export default App;