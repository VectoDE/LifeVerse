import React from 'react';
import '../assets/styles/Alert.css';

interface AlertProps {
    message: string;
    type: 'success' | 'error' | 'warning';
}

const Alert: React.FC<AlertProps> = ({ message, type }) => {
    return (
        <div className={`alert ${type}`}>
            <p>{message}</p>
        </div>
    );
};

export default Alert;
