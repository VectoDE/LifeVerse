import React from 'react';
import '../assets/styles/SearchBar.css';

interface SearchBarProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = 'Search...' }) => {
    return (
        <div className="search-bar">
            <input
                type="text"
                value={value}
                onChange={onChange}
                className="search-input"
                placeholder={placeholder}
            />
        </div>
    );
};

export default SearchBar;
