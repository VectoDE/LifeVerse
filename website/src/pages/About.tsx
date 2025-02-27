import React from 'react';

const About: React.FC = () => {
    return (
        <div className="p-4">
            <h1 className="text-4xl font-bold text-center text-gray-800 mt-8">About Us</h1>
            <p className="text-lg text-gray-700 mt-4">
                Welcome to our website. We are a passionate team committed to providing excellent services and products to our users. Our mission is to create amazing experiences that make a difference.
            </p>
            <section className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-800">Our Mission</h2>
                <p className="text-lg text-gray-700 mt-2">
                    We aim to build innovative solutions that empower people and help them achieve their goals. Whether it’s through technology, design, or user experience, we’re here to create something meaningful.
                </p>
            </section>
            <section className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-800">Our Values</h2>
                <ul className="list-disc pl-5 mt-2 text-lg text-gray-700">
                    <li>Innovation</li>
                    <li>Customer-Centricity</li>
                    <li>Integrity</li>
                    <li>Collaboration</li>
                </ul>
            </section>
        </div>
    );
};

export default About;
