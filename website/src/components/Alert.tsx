import React from 'react';

interface AlertProps {
    type: 'success' | 'warning' | 'error';
    title: string;
    message: string;
    onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {
    let bgColor, borderColor, iconColor;

    switch (type) {
        case 'success':
            bgColor = 'bg-green-100';
            borderColor = 'border-l-green-500';
            iconColor = 'bg-green-500';
            break;
        case 'warning':
            bgColor = 'bg-yellow-100';
            borderColor = 'border-l-yellow-500';
            iconColor = 'bg-yellow-500';
            break;
        case 'error':
            bgColor = 'bg-red-100';
            borderColor = 'border-l-red-500';
            iconColor = 'bg-red-500';
            break;
        default:
            bgColor = 'bg-gray-100';
            borderColor = 'border-l-gray-500';
            iconColor = 'bg-gray-500';
            break;
    }

    return (
        <div className={`py-10 ${bgColor} dark:bg-dark`}>
            <div className="container">
                <div className={`flex max-w-[655px] items-center rounded-md border-l-[6px] p-5 pl-6 ${borderColor}`}>
                    <div className={`${iconColor} mr-5 flex h-[36px] w-[36px] items-center justify-center rounded-full`}>
                        {/* Icon based on alert type */}
                        {type === 'success' && (
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16.5 4.5L7.5 13.5L4.5 10.5L5.91 9.09L7.5 10.68L14.09 4.5L16.5 4.5Z"
                                    fill="white"
                                />
                            </svg>
                        )}
                        {type === 'warning' && (
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M9 1L1 16H17L9 1Z"
                                    fill="white"
                                />
                            </svg>
                        )}
                        {type === 'error' && (
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M9 1C4.02944 1 1 4.02944 1 9C1 13.9706 4.02944 17 9 17C13.9706 17 17 13.9706 17 9C17 4.02944 13.9706 1 9 1ZM9 15C5.68629 15 3 12.3137 3 9C3 5.68629 5.68629 3 9 3C12.3137 3 15 5.68629 15 9C15 12.3137 12.3137 15 9 15ZM9 7C8.44772 7 8 7.44772 8 8V9C8 9.55228 8.44772 10 9 10C9.55228 10 10 9.55228 10 9V8C10 7.44772 9.55228 7 9 7ZM9 11C8.44772 11 8 11.4477 8 12C8 12.5523 8.44772 13 9 13C9.55228 13 10 12.5523 10 12C10 11.4477 9.55228 11 9 11Z"
                                    fill="white"
                                />
                            </svg>
                        )}
                    </div>

                    <div className="flex items-center justify-between w-full">
                        <div>
                            <h3 className="mb-1 text-lg font-medium text-black dark:text-white">{title}</h3>
                            <p className="text-sm text-body-color dark:text-dark-6">{message}</p>
                        </div>
                        <div>
                            <button
                                className="duration-300 text-dark-3 hover:text-dark dark:text-dark-4 dark:hover:text-dark-6"
                                onClick={onClose}
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M11 10L18.625 2.375C18.9062 2.09375 18.9062 1.65625 18.625 1.375C18.3438 1.09375 17.9062 1.09375 17.625 1.375L10 9L2.375 1.375C2.09375 1.09375 1.65625 1.09375 1.375 1.375C1.09375 1.65625 1.09375 2.09375 1.375 2.375L9 10L1.375 17.625C1.09375 17.9062 1.09375 18.3438 1.375 18.625C1.5 18.75 1.6875 18.8438 1.875 18.8438C2.0625 18.8438 2.25 18.7812 2.375 18.625L10 11L17.625 18.625C17.75 18.75 17.9375 18.8438 18.125 18.8438C18.3125 18.8438 18.5 18.7812 18.625 18.625C18.9062 18.3438 18.9062 17.9062 18.625 17.625L11 10Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Alert;
