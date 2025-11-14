// src/components/TechnologyCard.jsx
import './TechnologyCard.css';

function TechnologyCard({ title, description, status }) {
  return (
    <div className={`technology-card ${status}`}>
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <span className={`status-badge ${status}`}>
          {getStatusText(status)}
        </span>
      </div>
      <p className="card-description">{description}</p>
      <div className="card-footer">
        {renderStatusIcon(status)}
      </div>
    </div>
  );
}

// Функция для получения текста статуса
function getStatusText(status) {
  const statusMap = {
    'completed': 'Изучено',
    'in-progress': 'В процессе', 
    'not-started': 'Не начато'
  };
  return statusMap[status] || status;
}

// Функция для отображения иконки статуса
function renderStatusIcon(status) {
  const icons = {
    'completed': '✅',
    'in-progress': '⏳',
    'not-started': '⭕'
  };
  return <span className="status-icon">{icons[status] || '📌'}</span>;
}

export default TechnologyCard;