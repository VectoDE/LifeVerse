import React from 'react';
import '../assets/styles/Card.css';

interface CardProps {
    title: string;
    description: string;
    imageUrl: string;
    link: string;
}

const Card: React.FC<CardProps> = ({ title, description, imageUrl, link }) => {
    return (
        <div className="card card-wrapper">
            <img src={imageUrl} alt={title} />
            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                <p className="card-description">{description}</p>
                <a href={link} className="card-link">Learn More</a>
            </div>
        </div>
    );
};

export default Card;
