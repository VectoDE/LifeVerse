import React from 'react';

interface CardProps {
    title: string;
    description: string;
    imageUrl: string;
    link: string;
}

const Card: React.FC<CardProps> = ({ title, description, imageUrl, link }) => {
    return (
        <div className="max-w-xs rounded-lg border border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <img src={imageUrl} alt={title} className="w-full h-48 object-cover rounded-t-lg" />
            <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
                <a
                    href={link}
                    className="mt-4 inline-block text-blue-600 hover:text-blue-800"
                >
                    Learn more
                </a>
            </div>
        </div>
    );
};

export default Card;
