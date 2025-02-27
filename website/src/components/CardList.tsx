import React from 'react';
import Card from './Card';

interface CardListProps {
    cards: Array<{
        title: string;
        description: string;
        imageUrl: string;
        link: string;
    }>;
}

const CardList: React.FC<CardListProps> = ({ cards }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
