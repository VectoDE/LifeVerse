import React, { useState } from 'react';
import '../assets/styles/Accordion.css';

interface AccordionItem {
    title: string;
    content: React.ReactNode;
}

interface AccordionProps {
    items: AccordionItem[];
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="accordion">
            {items.map((item, index) => (
                <div key={index} className="accordion-item">
                    <div className="accordion-header" onClick={() => toggleItem(index)}>
                        <h3>{item.title}</h3>
                    </div>
                    {openIndex === index && <div className="accordion-content">{item.content}</div>}
                </div>
            ))}
        </div>
    );
};

export default Accordion;
