import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setQuery, clearQuery } from '../stores/searchSlice';

interface RootState {
    search: {
        query: string;
    };
}

const SearchBar: React.FC = () => {
    const dispatch = useDispatch();
    const query = useSelector((state: RootState) => state.search.query);
    const [inputValue, setInputValue] = useState(query);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSearch = () => {
        dispatch(setQuery(inputValue));
    };

    const handleClear = () => {
        setInputValue('');
        dispatch(clearQuery());
    };

    return (
        <div className="relative w-full max-w-xs mx-auto">
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search..."
            />
            <button
                onClick={handleSearch}
                className="absolute top-0 right-0 mt-2 mr-2 text-blue-500 hover:text-blue-700"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 20 20"
                >
                    <path
                        fill="currentColor"
                        d="M17.39 15.42l-4.69-4.69c1.22-1.76 1.6-3.92 1.03-6.01C13.35 2.94 10.5 1 7.31 1 3.27 1 0 4.27 0 7.31c0 3.04 3.27 6.31 7.31 6.31 1.75 0 3.37-.57 4.74-1.52l4.69 4.69c.19.19.45.29.71.29s.51-.1.71-.29c.38-.38.38-.99 0-1.37zm-10.08-5.12c-2.26 0-4.1-1.84-4.1-4.1s1.84-4.1 4.1-4.1c2.26 0 4.1 1.84 4.1 4.1s-1.84 4.1-4.1 4.1z"
                    />
                </svg>
            </button>
            {inputValue && (
                <button
                    onClick={handleClear}
                    className="absolute top-0 right-0 mt-2 mr-8 text-gray-400 hover:text-gray-600"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fill="currentColor"
                            d="M10 8l-4 4m0 0l4 4m-4-4h8"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default SearchBar;
