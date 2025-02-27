import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M18 6L6 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M6 6L18 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="mb-4">
                    {children}
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="py-2 px-4 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                    >
                        Schließen
                    </button>
                    <button
                        onClick={onClose}
                        className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Bestätigen
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
