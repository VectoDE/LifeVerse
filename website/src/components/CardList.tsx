import React from 'react';
import Card from './Card';
import '../assets/styles/CardList.css';

interface CardListProps {
    cards: { title: string; description: string; imageUrl: string; link: string }[];
}

const CardList: React.FC<CardListProps> = ({ cards }) => {
    return (
        <div className="card-list">
            {cards.map((card, index) => (
                <Card
                    key={index}
                    title={card.title}
                    description={card.description}
                    imageUrl={card.imageUrl}
                    link={card.link}
                />
            ))}
        </div>
    );
};

export default CardList;
