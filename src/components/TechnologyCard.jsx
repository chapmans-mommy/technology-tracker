import './TechnologyCard.css';

function TechnologyCard({ technology, onStatusChange, onNotesChange }) {
  const handleClick = () => {
    const statusOrder = ['not-started', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(technology.status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    const nextStatus = statusOrder[nextIndex];
    
    onStatusChange(technology.id, nextStatus);
  };

  const handleNotesChange = (e) => {
    onNotesChange(technology.id, e.target.value);
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
    <div className={`technology-card ${technology.status}`}>
      <div className="card-header">
        <h3 className="card-title">{technology.title}</h3>
        <span className={`status-badge ${technology.status}`}>
          {getStatusText(technology.status)}
        </span>
      </div>
      <p className="card-description">{technology.description}</p>
      
      {/* Секция заметок */}
      <div className="notes-section">
        <h4>Мои заметки:</h4>
        <textarea
          value={technology.notes}
          onChange={handleNotesChange}
          placeholder="Записывайте сюда важные моменты..."
          rows="3"
        />
        <div className="notes-hint">
          {technology.notes.length > 0 ? `Заметка сохранена (${technology.notes.length} символов)` : 'Добавьте заметку'}
        </div>
      </div>

      <div className="card-footer">
        {renderStatusIcon(technology.status)}
        <span className="click-hint" onClick={handleClick}>Кликните для смены статуса</span>
      </div>
    </div>
  );
}

export default TechnologyCard;