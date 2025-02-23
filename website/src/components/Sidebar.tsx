import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/Sidebar.css';

interface SidebarProps {
    items: { label: string, path: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
    return (
        <div className="sidebar">
            <ul>
                {items.map((item, index) => (
                    <li key={index}>
                        <Link to={item.path} className="sidebar-item">
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
