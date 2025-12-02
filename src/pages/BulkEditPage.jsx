import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BulkStatusEditor from '../components/BulkStatusEditor';
import useTechnologiesApi from '../hooks/useTechnologiesApi';

function BulkEditPage() {
    const navigate = useNavigate();
    const { 
        technologies, 
        loading, 
        error, 
        bulkUpdateStatuses 
    } = useTechnologiesApi();
    
    const [updateMessage, setUpdateMessage] = useState('');

    const handleUpdateStatuses = (updates) => {
        try {
            bulkUpdateStatuses(updates);
            
            setUpdateMessage(`✅ Обновлено ${updates.length} технологий`);
            
            setTimeout(() => {
                setUpdateMessage('');
            }, 3000);
            
        } catch (err) {
            console.error('Ошибка массового обновления:', err);
            setUpdateMessage('❌ Ошибка при обновлении');
        }
    };

    const handleClose = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Загрузка технологий...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page">
                <div className="error-state">
                    <h2>Ошибка</h2>
                    <p>{error}</p>
                    <Link to="/" className="btn">На главную</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="page-header">
                <h1>Массовое редактирование статусов</h1>
                <Link to="/" className="btn btn-secondary">
                    ← На главную
                </Link>
            </div>

            {updateMessage && (
                <div className="global-message" role="status">
                    {updateMessage}
                </div>
            )}

            <div className="page-content">
                <BulkStatusEditor
                    technologies={technologies}
                    onUpdateStatuses={handleUpdateStatuses}
                    onClose={handleClose}
                />
            </div>
        </div>
    );
}

export default BulkEditPage;