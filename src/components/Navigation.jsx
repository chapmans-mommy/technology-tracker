import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';
import ThemeToggleButton from '../components/ThemeToggle';

function Navigation() {
    const location = useLocation();
    const scrollContainerRef = useRef(null);
    const [showLeftScroll, setShowLeftScroll] = useState(false);
    const [showRightScroll, setShowRightScroll] = useState(true);

    const checkScrollButtons = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;
        
        setShowLeftScroll(scrollLeft > 10);
        setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        checkScrollButtons();
        
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollButtons);
            window.addEventListener('resize', checkScrollButtons);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', checkScrollButtons);
            }
            window.removeEventListener('resize', checkScrollButtons);
        };
    }, []);

    return (
        <nav className="main-navigation">
            <div className="nav-container">
                <div className="nav-brand">
                    <Link to="/">
                        <h2>Трекер технологий</h2>
                    </Link>
                    <ThemeToggleButton size="small" sx={{ ml: 2 }} />
                </div>

                {/* Кнопка прокрутки влево */}
                <div className={`scroll-indicator left ${showLeftScroll ? 'visible' : ''}`}>
                    <button 
                        className="scroll-btn" 
                        onClick={scrollLeft}
                        aria-label="Прокрутить навигацию влево"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                </div>

                {/* Контейнер с горизонтальным скроллом */}
                <div 
                    className="nav-scroll-container" 
                    ref={scrollContainerRef}
                    role="navigation"
                    aria-label="Основная навигация"
                >
                    <ul className="nav-menu">
                        <li>
                            <Link
                                to="/"
                                className={location.pathname === '/' ? 'active' : ''}
                                aria-current={location.pathname === '/' ? 'page' : undefined}
                            >
                                <span>Главная</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/technologies"
                                className={location.pathname === '/technologies' ? 'active' : ''}
                                aria-current={location.pathname === '/technologies' ? 'page' : undefined}
                            >
                                <span>Технологии</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/deadlines"
                                className={location.pathname === '/deadlines' ? 'active' : ''}
                                aria-current={location.pathname === '/deadlines' ? 'page' : undefined}
                            >
                                <span>Сроки</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/bulk-edit"
                                className={location.pathname === '/bulk-edit' ? 'active' : ''}
                                aria-current={location.pathname === '/bulk-edit' ? 'page' : undefined}
                            >
                                <span>Массовое редактирование</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/statistics"
                                className={location.pathname === '/statistics' ? 'active' : ''}
                                aria-current={location.pathname === '/statistics' ? 'page' : undefined}
                            >
                                <span>Статистика</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/settings"
                                className={location.pathname === '/settings' ? 'active' : ''}
                                aria-current={location.pathname === '/settings' ? 'page' : undefined}
                            >
                                <span>Настройки</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;