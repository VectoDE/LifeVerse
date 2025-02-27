import React, { useState } from 'react';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [status, setStatus] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Submitting...');

        // Simulating form submission
        setTimeout(() => {
            setStatus('Thank you for contacting us!');
            setFormData({ name: '', email: '', message: '' });
        }, 2000);
    };

    return (
        <div className="p-4">
            <h1 className="text-4xl font-bold text-center text-gray-800 mt-8">Contact Us</h1>
            <p className="text-lg text-gray-700 mt-4 text-center">
                Have questions or need assistance? Fill out the form below, and we will get back to you as soon as possible!
            </p>
            <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-lg text-gray-700">Name</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded mt-2"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-lg text-gray-700">Email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded mt-2"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="message" className="block text-lg text-gray-700">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full p-2 border border-gray-300 rounded mt-2"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded mt-4 hover:bg-blue-700 transition"
                >
                    Submit
                </button>
            </form>
            {status && <div className="mt-4 text-center text-lg text-gray-700">{status}</div>}
        </div>
    );
};

export default Contact;
