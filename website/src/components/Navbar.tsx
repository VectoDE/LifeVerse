import '../assets/styles/Navbar.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/userSlice';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
    isLoggedIn: boolean;
    user: { username: string; profilePicture: string; hasTickets: boolean };
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, user }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const theme = useSelector((state: RootState) => state.theme.theme);

    const toggleDropdown = () => {
        setDropdownOpen(prevState => !prevState);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className={`navbar ${theme === 'dark' ? 'dark' : ''}`}>
            <div className="navbar-container">
                {/* Left (News, Store) */}
                <div className="navbar-left">
                    <a href="/news" className="navbar-link">News</a>
                    <a href="/store" className="navbar-link">Store</a>
                </div>

                {/* Logo */}
                <div className="navbar-logo">
                    <img src="/assets/logo.png" alt="LifeVerse Logo" className="logo" />
                </div>

                {/* Right (Downloads, Support) */}
                <div className="navbar-right">
                    <a href="/downloads" className="navbar-link">Downloads</a>
                    <a href="/support" className="navbar-link">Support</a>

                    {/* Login/Profile */}
                    {isLoggedIn ? (
                        <div className="navbar-profile" onClick={toggleDropdown}>
                            <img src={user.profilePicture} alt={user.username} className="profile-pic" />
                            <span className="profile-username">{user.username}</span>
                            {dropdownOpen && (
                                <div className="dropdown-menu">
                                    <a href="/profile" className="dropdown-item">Profile</a>
                                    {user.hasTickets && <a href="/tickets" className="dropdown-item">Tickets</a>}
                                    <a href="/settings" className="dropdown-item">Settings</a>
                                    <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <a href="/login" className="navbar-link">Login</a>
                    )}

                    {/* Theme Toggle Button */}
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
