import { useState, useEffect } from 'react';
import TechnologyResources from './TechnologyResources';
import './TechnologyCard.css';

function TechnologyCard({ technology, onStatusChange, onNotesChange }) {
  const [showResources, setShowResources] = useState(false);
  const [localNotes, setLocalNotes] = useState(technology.notes || '');

  useEffect(() => {
    setLocalNotes(technology.notes || '');
  }, [technology.notes]);

  const handleClick = () => {
    const statusOrder = ['not-started', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(technology.status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    const nextStatus = statusOrder[nextIndex];
    
    onStatusChange(technology.id, nextStatus);
  };

  const handleNotesChange = (e) => {
    const value = e.target.value;
    setLocalNotes(value);
    onNotesChange(technology.id, value);
  };

  const getStatusText = (status) => {
    const statusMap = {
      'completed': 'Изучено',
      'in-progress': 'В процессе', 
      'not-started': 'Не начато'
    };
    return statusMap[status] || status;
  };

  const renderStatusIcon = (status) => {
    const icons = {
      'completed': '✅',
      'in-progress': '⏳',
      'not-started': '⭕'
    };
    return <span className="status-icon">{icons[status] || '📌'}</span>;
  };

  return (
    <>
      <div className={`technology-card ${technology.status}`}>
        <div className="card-header">
          <h3 className="card-title">{technology.title}</h3>
          <span className={`status-badge ${technology.status}`}>
            {getStatusText(technology.status)}
          </span>
        </div>
        
        <div className="card-category">
          <span className="category-badge">{technology.category || 'frontend'}</span>
          {technology.difficulty && (
            <span className={`difficulty-badge difficulty-${technology.difficulty}`}>
              {technology.difficulty === 'beginner' ? '👶 Начинающий' : 
               technology.difficulty === 'intermediate' ? '⚡ Средний' : 
               '🔥 Продвинутый'}
            </span>
          )}
        </div>
        
        <p className="card-description">{technology.description}</p>
        
        {technology.resources && technology.resources.length > 0 && (
          <div className="resource-preview">
            <span className="resource-count">
              📚 {technology.resources.length} ресурс(ов)
            </span>
          </div>
        )}
        
        <div className="notes-section">
          <h4>Мои заметки:</h4>
          <textarea
            value={localNotes}
            onChange={handleNotesChange}
            placeholder="Записывайте сюда важные моменты..."
            rows="3"
          />
          <div className="notes-hint">
            {localNotes.length > 0 ? `Заметка сохранена (${localNotes.length} символов)` : 'Добавьте заметку'}
          </div>
        </div>

        <div className="card-actions">
          <button 
            onClick={handleClick}
            className={`status-btn ${technology.status}`}
          >
            {renderStatusIcon(technology.status)}
            Сменить статус
          </button>
          
          <button 
            onClick={() => setShowResources(true)}
            className="resources-btn"
          >
            📚 Ресурсы
          </button>
        </div>

        <div className="card-footer">
          <span className="click-hint">Кликните на кнопку для смены статуса</span>
        </div>
      </div>

      {showResources && (
        <div className="resources-modal">
          <div className="modal-overlay" onClick={() => setShowResources(false)}></div>
          <div className="modal-content">
            <TechnologyResources 
              technology={technology}
              onClose={() => setShowResources(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default TechnologyCard;