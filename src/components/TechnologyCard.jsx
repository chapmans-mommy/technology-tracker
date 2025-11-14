import './TechnologyCard.css';

function TechnologyCard({ technology, onStatusChange }) {
  const handleClick = () => {
    const statusOrder = ['not-started', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(technology.status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    const nextStatus = statusOrder[nextIndex];
    
    onStatusChange(technology.id, nextStatus);
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
    <div 
      className={`technology-card ${technology.status}`}
      onClick={handleClick}
    >
      <div className="card-header">
        <h3 className="card-title">{technology.title}</h3>
        <span className={`status-badge ${technology.status}`}>
          {getStatusText(technology.status)}
        </span>
      </div>
      <p className="card-description">{technology.description}</p>
      <div className="card-footer">
        {renderStatusIcon(technology.status)}
        <span className="click-hint">Кликните для смены статуса</span>
      </div>
    </div>
  );
}

export default TechnologyCard;