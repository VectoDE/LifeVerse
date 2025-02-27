import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    return (
        <div
            className={`fixed top-0 left-0 z-30 w-64 bg-gray-800 text-white transition-transform ${
                isOpen ? 'transform-none' : '-translate-x-full'
            } h-full md:transform-none md:translate-x-0`}
        >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 bg-gray-900">
                <h2 className="text-xl font-bold">My App</h2>
                <button
                    onClick={toggleSidebar}
                    className="text-white md:hidden"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4 5H20C20.5523 5 21 5.44772 21 6C21 6.55228 20.5523 7 20 7H4C3.44772 7 3 6.55228 3 6C3 5.44772 3.44772 5 4 5ZM4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11ZM4 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18C3 17.4477 3.44772 17 4 17Z"
                            fill="currentColor"
                        />
                    </svg>
                </button>
            </div>

            {/* Sidebar Links */}
            <div className="flex flex-col mt-4 space-y-2">
                <Link
                    to="/dashboard"
                    className="text-white p-4 hover:bg-gray-700 transition-colors"
                >
                    Dashboard
                </Link>
                <Link
                    to="/profile"
                    className="text-white p-4 hover:bg-gray-700 transition-colors"
                >
                    Profile
                </Link>
                <Link
                    to="/settings"
                    className="text-white p-4 hover:bg-gray-700 transition-colors"
                >
                    Settings
                </Link>
                <Link
                    to="/help"
                    className="text-white p-4 hover:bg-gray-700 transition-colors"
                >
                    Help
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
