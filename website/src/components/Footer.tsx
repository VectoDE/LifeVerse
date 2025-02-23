import React from 'react';
import '../assets/styles/Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="container">
                <p>&copy; {new Date().getFullYear()} LifeVerse Studios. All rights reserved.</p>
                <div>
                    <a href="/privacy-policy" className="text-blue-400 hover:underline">Privacy Policy</a> | 
                    <a href="/terms-of-service" className="text-blue-400 hover:underline"> Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
