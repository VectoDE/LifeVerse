import React, { useState } from 'react';

interface StepperProps {
    steps: string[];
}

const Stepper: React.FC<StepperProps> = ({ steps }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const nextStep = () => {
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    return (
        <div>
            <div className="flex justify-between mb-4">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className={`flex-1 text-center py-2 ${index <= currentStep ? 'text-blue-500' : 'text-gray-500'
                            }`}
                    >
                        <span className={`block font-semibold ${index === currentStep ? 'text-xl' : ''}`}>
                            {step}
                        </span>
                        {index < steps.length - 1 && (
                            <div className="w-full h-1 bg-gray-300 mt-1 mx-auto"></div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-between mt-4">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={nextStep}
                    disabled={currentStep === steps.length - 1}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Stepper;
