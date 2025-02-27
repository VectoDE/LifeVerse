import React from 'react';

interface ProgressBarProps {
    progress: number;
    height?: string;
    color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, height = '8px', color = 'bg-blue-500' }) => {
    const normalizedProgress = Math.min(100, Math.max(0, progress));

    return (
        <div className="w-full bg-gray-300 rounded-full" style={{ height }}>
            <div
                className={`rounded-full ${color}`}
                style={{ width: `${normalizedProgress}%`, height }}
            />
        </div>
    );
};

export default ProgressBar;
