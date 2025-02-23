import React from 'react';
import '../assets/styles/Button.css';

interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary' }) => {
    return (
        <button className={`btn ${variant}`} onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;
