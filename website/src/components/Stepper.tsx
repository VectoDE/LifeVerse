import React, { useState } from 'react';
import '../assets/styles/Stepper.css';

interface StepperProps {
    steps: string[];
}

const Stepper: React.FC<StepperProps> = ({ steps }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const goToNextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const goToPreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="stepper">
            <div className="stepper-steps">
                {steps.map((step, index) => (
                    <div key={index} className={`step ${index <= currentStep ? 'active' : ''}`}>
                        {step}
                    </div>
                ))}
            </div>
            <div className="stepper-controls">
                <button onClick={goToPreviousStep} disabled={currentStep === 0}>Previous</button>
                <button onClick={goToNextStep} disabled={currentStep === steps.length - 1}>Next</button>
            </div>
        </div>
    );
};

export default Stepper;
