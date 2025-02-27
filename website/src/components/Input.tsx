import React from 'react';

interface InputProps {
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    icon?: React.ReactNode;
    required?: boolean;
}

const Input: React.FC<InputProps> = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    error,
    icon,
    required = false,
}) => {
    return (
        <div className="relative mb-6">
            {/* Label */}
            <label
                htmlFor={label}
                className={`block text-sm font-medium text-gray-700 ${error ? 'text-red-600' : ''}`}
            >
                {label} {required && <span className="text-red-600">*</span>}
            </label>

            {/* Input Container */}
            <div className="relative mt-2">
                {icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    id={label}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full px-4 py-2 pr-10 rounded-md border-2 ${error ? 'border-red-600' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
            </div>

            {/* Error message */}
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
};

export default Input;
