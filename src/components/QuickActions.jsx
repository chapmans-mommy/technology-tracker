import './QuickActions.css';

function QuickActions({ technologies, onMarkAllCompleted, onResetAll, onRandomSelect }) {
  const hasTechnologies = technologies.length > 0;

  if (!hasTechnologies) {
    return null;
  }

  return (
    <div className="quick-actions">
      <h3>Быстрые действия</h3>
      <div className="action-buttons">
        <button 
          onClick={onMarkAllCompleted}
          className="action-btn complete-all"
        >
          Отметить все как выполненные
        </button>
        <button 
          onClick={onResetAll}
          className="action-btn reset-all"
        >
          Сбросить все статусы
        </button>
        <button 
          onClick={onRandomSelect}
          className="action-btn random-select"
        >
          Случайный выбор следующей технологии
        </button>
      </div>
    </div>
  );
}

export default QuickActions;