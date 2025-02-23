import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setTheme } from '../store/themeSlice';

const ThemeToggle: React.FC = () => {
    const theme = useSelector((state: RootState) => state.theme.theme);
    const dispatch = useDispatch();

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        dispatch(setTheme(newTheme));
    };

    useEffect(() => {
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        document.body.style.backgroundColor = theme === 'light' ? '#fff' : '#333';
        document.body.style.color = theme === 'light' ? '#000' : '#fff';
    }, [theme]);

    return (
        <div>
            <button 
                onClick={toggleTheme} 
                style={{
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    backgroundColor: theme === 'light' ? '#007bff' : '#333',
                    color: theme === 'light' ? '#fff' : '#fff',
                    border: 'none',
                    transition: 'background-color 0.3s ease',
                }}
            >
                {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            </button>
        </div>
    );
};

export default ThemeToggle;
