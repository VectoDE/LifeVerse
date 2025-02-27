import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
    initialMinutes: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ initialMinutes }) => {
    const [timeLeft, setTimeLeft] = useState<number>(initialMinutes * 60);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isRunning && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isRunning, timeLeft]);

    const handleStart = () => setIsRunning(true);
    const handlePause = () => setIsRunning(false);
    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(initialMinutes * 60);
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Countdown Timer</h2>
            <div className="text-4xl font-mono text-gray-800">
                {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </div>
            <div className="mt-4 space-x-4">
                {isRunning ? (
                    <button
                        onClick={handlePause}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Pause
                    </button>
                ) : (
                    <button
                        onClick={handleStart}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        Start
                    </button>
                )}
                <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default CountdownTimer;
