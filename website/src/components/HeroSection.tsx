import React from 'react';
import '../assets/styles/HeroSection.css';

const HeroSection: React.FC = () => {
    return (
        <section className="hero-section">
            <div className="hero-content">
                <h1 className="hero-title">Willkommen bei LifeVerse</h1>
                <p className="hero-description">
                    Entdecke die lebendigste Open-World-Simulation, die jemals erschaffen wurde.
                </p>
                <button className="hero-button">Jetzt spielen</button>
            </div>
        </section>
    );
};

export default HeroSection;
