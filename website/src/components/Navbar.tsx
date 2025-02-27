import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../stores/store';
import { logout } from '../stores/authSlice';

const Nav: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dispatch = useDispatch();

    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const handleLogout = () => {
        dispatch(logout());
        setDropdownOpen(false);
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="flex items-center justify-between">
                {/* Left Links (News, Store) */}
                <div className="flex space-x-8">
                    <Link to="/news" className="text-white hover:text-gray-400">News</Link>
                    <Link to="/store" className="text-white hover:text-gray-400">Store</Link>
                </div>

                {/* Logo in der Mitte */}
                <div className="flex justify-center flex-1">
                    <img src="/images/logo.png" alt="Logo" className="h-8 w-8 mr-3" />
                </div>

                {/* Right Links (Downloads, Support) */}
                <div className="flex space-x-8">
                    <Link to="/downloads" className="text-white hover:text-gray-400">Downloads</Link>
                    <Link to="/support" className="text-white hover:text-gray-400">Support</Link>
                </div>

                {/* Profile Section */}
                <div className="relative">
                    {isAuthenticated ? (
                        <button
                            onClick={toggleDropdown}
                            className="flex items-center space-x-2 text-white hover:text-gray-400"
                        >
                            <img
                                src="/images/profile-picture.jpg"
                                alt="Profile"
                                className="h-8 w-8 rounded-full"
                            />
                            <span>{user?.username}</span>
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="text-white hover:text-gray-400"
                        >
                            Login
                        </Link>
                    )}

                    {/* Dropdown Menu */}
                    {dropdownOpen && isAuthenticated && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-700 text-white rounded-lg shadow-lg">
                            <ul className="space-y-2 py-2">
                                <li>
                                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-600">Profile</Link>
                                </li>
                                <li>
                                    <Link to="/settings" className="block px-4 py-2 hover:bg-gray-600">Settings</Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout} className="block w-full px-4 py-2 hover:bg-gray-600">Logout</button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Nav;
