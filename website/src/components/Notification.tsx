import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearNotification } from '../stores/notificationSlice';

interface RootState {
    notification: {
        message: string | null;
        type: 'success' | 'warn' | 'info' | 'error' | null;
    };
}

const Notification: React.FC = () => {
    const dispatch = useDispatch();
    const { message, type } = useSelector((state: RootState) => state.notification);

    // Close notification after 5 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                dispatch(clearNotification());
            }, 5000);

            return () => clearTimeout(timer); // Clean up timer on component unmount
        }
    }, [message, dispatch]);

    // Style classes based on notification type
    const notificationClass = type
        ? `p-4 rounded-md text-white ${type === 'success' ? 'bg-green-500' : type === 'warn' ? 'bg-yellow-500' : type === 'info' ? 'bg-blue-500' : 'bg-red-500'}`
        : '';

    return message ? (
        <div className={`fixed bottom-4 right-4 max-w-xs ${notificationClass}`}>
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-medium">{message}</p>
                </div>
                <button
                    onClick={() => dispatch(clearNotification())}
                    className="text-white hover:text-gray-200"
                >
                    <svg
                        width="20"
                        height="20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M18 6L6 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M6 6L18 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>
        </div>
    ) : null;
};

export default Notification;
