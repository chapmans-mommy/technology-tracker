import { useState } from 'react';
import './RoadmapImporter.css';

function RoadmapImporter({ onImport }) {
    const [importing, setImporting] = useState(false);
    const [customUrl, setCustomUrl] = useState('');

    const handleImportRoadmap = async (roadmapUrl) => {
        try {
            setImporting(true);

            // Имитация загрузки дорожной карты из API
            // В реальном приложении здесь будет реальный запрос
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Мок данные дорожной карты
            const mockRoadmapData = {
                technologies: [
                    {
                        id: Date.now() + 1,
                        title: 'Express.js',
                        description: 'Минималистичный веб-фреймворк для Node.js',
                        category: 'backend',
                        difficulty: 'intermediate',
                        status: 'not-started',
                        notes: '',
                        resources: ['https://expressjs.com']
                    },
                    {
                        id: Date.now() + 2,
                        title: 'PostgreSQL',
                        description: 'Реляционная система управления базами данных',
                        category: 'database',
                        difficulty: 'intermediate',
                        status: 'not-started',
                        notes: '',
                        resources: ['https://www.postgresql.org']
                    },
                    {
                        id: Date.now() + 3,
                        title: 'Git',
                        description: 'Распределенная система контроля версий',
                        category: 'tools',
                        difficulty: 'beginner',
                        status: 'not-started',
                        notes: '',
                        resources: ['https://git-scm.com']
                    }
                ]
            };

            // Вызываем callback для добавления технологий
            if (onImport) {
                onImport(mockRoadmapData.technologies);
            }

            alert(`Успешно импортировано ${mockRoadmapData.technologies.length} технологий`);

        } catch (err) {
            alert(`Ошибка импорта: ${err.message}`);
        } finally {
            setImporting(false);
        }
    };

    const handleExampleImport = () => {
        handleImportRoadmap('https://api.example.com/roadmaps/frontend');
    };

    const handleCustomImport = () => {
        if (customUrl.trim()) {
            handleImportRoadmap(customUrl);
        } else {
            alert('Введите URL для импорта');
        }
    };

    return (
        <div className="roadmap-importer">
            <h3>Импорт дорожной карты</h3>
            
            <div className="import-info">
                <p>Загрузите готовую дорожную карту для быстрого старта</p>
            </div>

            <div className="import-actions">
                <button
                    onClick={handleExampleImport}
                    disabled={importing}
                    className="import-button"
                >
                    {importing ? 'Импорт...' : 'Импорт пример дорожной карты'}
                </button>
            </div>

            <div className="custom-import">
                <h4>Или введите свой URL:</h4>
                <div className="url-input-group">
                    <input
                        type="text"
                        placeholder="https://api.example.com/roadmaps/backend"
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        className="url-input"
                    />
                    <button
                        onClick={handleCustomImport}
                        disabled={importing || !customUrl.trim()}
                        className="url-import-button"
                    >
                        Импорт
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RoadmapImporter;