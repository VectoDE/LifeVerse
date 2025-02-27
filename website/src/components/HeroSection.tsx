import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
    return (
        <section className="relative bg-blue-600 text-white py-20">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-4xl font-bold leading-tight mb-4">
                    Willkommen bei unserer fantastischen Website!
                </h1>
                <p className="text-lg mb-8">
                    Entdecken Sie alle großartigen Funktionen, die wir zu bieten haben. Tauchen Sie ein und starten Sie Ihre Reise.
                </p>
                <Link
                    to="/start"
                    className="bg-yellow-500 text-black py-3 px-6 rounded-lg text-lg font-semibold hover:bg-yellow-600 transition duration-300"
                >
                    Jetzt starten
                </Link>
            </div>
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-cover bg-center opacity-30" style={{ backgroundImage: 'url("/images/hero-bg.jpg")' }}></div>
        </section>
    );
};

export default HeroSection;
