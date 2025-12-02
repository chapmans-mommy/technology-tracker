// components/ApiStats.jsx
import './ApiStats.css';

function ApiStats({ technology }) {
  if (!technology.apiData) return null;

  const { github, stackoverflow } = technology.apiData;

  return (
    <div className="api-stats">
      <h4>API данные</h4>
      
      {github && (
        <div className="github-stats">
          <h5>GitHub</h5>
          <div className="stats-grid">
            <div className="stat">
              <span className="stat-label">⭐ Звёзды:</span>
              <span className="stat-value">{github.stargazers_count}</span>
            </div>
            <div className="stat">
              <span className="stat-label">🍴 Форки:</span>
              <span className="stat-value">{github.forks_count}</span>
            </div>
            <div className="stat">
              <span className="stat-label">👁️ Наблюдатели:</span>
              <span className="stat-value">{github.watchers_count}</span>
            </div>
            <div className="stat">
              <span className="stat-label">⚠️ Issues:</span>
              <span className="stat-value">{github.open_issues_count}</span>
            </div>
          </div>
          <a 
            href={github.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-link"
          >
            Открыть на GitHub ↗
          </a>
        </div>
      )}
      
      {stackoverflow && (
        <div className="stackoverflow-stats">
          <h5>Stack Overflow</h5>
          <div className="stat">
            <span className="stat-label">❓ Вопросов:</span>
            <span className="stat-value">{stackoverflow.questionCount}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApiStats;