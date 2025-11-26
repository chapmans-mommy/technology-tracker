import { useState, useEffect, useRef } from 'react';
import './TechnologySearch.css';

function TechnologySearch({ onSearch, technologies }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const searchTimeoutRef = useRef(null);
    const abortControllerRef = useRef(null);

    const handleSearch = async (query) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        try {
            setLoading(true);

            if (!query.trim()) {
                onSearch(technologies);
                setLoading(false);
                return;
            }

            // Имитация API запроса с фильтрацией
            await new Promise(resolve => setTimeout(resolve, 300));

            const filtered = technologies.filter(tech =>
                tech.title.toLowerCase().includes(query.toLowerCase()) ||
                tech.description.toLowerCase().includes(query.toLowerCase()) ||
                tech.category.toLowerCase().includes(query.toLowerCase())
            );

            onSearch(filtered);

        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Ошибка поиска:', err);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            handleSearch(value);
        }, 500);
    };

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return (
        <div className="technology-search">
            <div className="search-input-container">
                <input
                    type="text"
                    placeholder="🔍 Поиск по названию, описанию или категории..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                {loading && <div className="search-loading">⏳</div>}
            </div>
        </div>
    );
}

export default TechnologySearch;