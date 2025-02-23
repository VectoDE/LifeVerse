import React, { useState, useEffect } from 'react';
import '../assets/styles/LazyLoading.css';

const LazyLoading: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`loading-container ${isLoading ? 'active' : 'inactive'}`}>
            <div className="loading-spinner"></div>
            <p>Seite wird geladen...</p>
        </div>
    );
};

export default LazyLoading;
