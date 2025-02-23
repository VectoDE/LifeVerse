import React, { useEffect } from 'react';
import '../assets/styles/Notification.css';

interface NotificationProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`notification ${type}`}>
            <p>{message}</p>
            <button onClick={onClose} className="close-btn">×</button>
        </div>
    );
};

export default Notification;
