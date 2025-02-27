import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
            <p className="text-gray-600 mt-2">Oops! The page you are looking for does not exist.</p>
            <Link to="/" className="mt-4 text-blue-500 hover:underline">
                Go back to Home
            </Link>
        </div>
    );
};

export default NotFound;
