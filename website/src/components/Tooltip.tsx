import React, { useState } from 'react';
import '../assets/styles/Tooltip.css';

interface TooltipProps {
    text: string;
    children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="tooltip-container" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
            {children}
            {isVisible && <div className="tooltip">{text}</div>}
        </div>
    );
};

export default Tooltip;
