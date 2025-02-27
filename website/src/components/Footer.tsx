import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white py-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Logo and Social Icons */}
                    <div>
                        <div className="flex items-center mb-4">
                            <img src="/images/logo.png" alt="Logo" className="h-8 w-8 mr-3" />
                            <span className="text-xl font-bold">MyWebsite</span>
                        </div>
                        <p className="text-sm text-gray-400">Your tagline or short description.</p>
                        <div className="flex space-x-4 mt-4">
                            <a href="/" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faFacebookF} size="lg" />
                            </a>
                            <a href="/" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faTwitter} size="lg" />
                            </a>
                            <a href="/" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faInstagram} size="lg" />
                            </a>
                            <a href="/" target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faLinkedinIn} size="lg" />
                            </a>
                        </div>
                    </div>

                    {/* Important Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Important Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-white">About Us</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link>
                            </li>
                            <li>
                                <Link to="/services" className="text-gray-400 hover:text-white">Services</Link>
                            </li>
                            <li>
                                <Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Downloads Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Downloads</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="/download/app" className="text-gray-400 hover:text-white">Download App</a>
                            </li>
                            <li>
                                <a href="/download/brochure" className="text-gray-400 hover:text-white">Download Brochure</a>
                            </li>
                            <li>
                                <a href="/download/guide" className="text-gray-400 hover:text-white">Download Guide</a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="/terms" className="text-gray-400 hover:text-white">Terms of Service</a>
                            </li>
                            <li>
                                <a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a>
                            </li>
                            <li>
                                <a href="/cookie-policy" className="text-gray-400 hover:text-white">Cookie Policy</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright Line */}
                <div className="text-center mt-10 text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} MyWebsite. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
