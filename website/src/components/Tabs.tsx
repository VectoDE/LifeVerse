import React, { useState } from 'react';
import '../assets/styles/Tabs.css';

interface Tab {
    label: string;
    content: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState<number>(0);

    return (
        <div className="tabs">
            <div className="tab-titles">
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        className={`tab-title ${index === activeTab ? 'active' : ''}`}
                        onClick={() => setActiveTab(index)}
                    >
                        {tab.label}
                    </div>
                ))}
            </div>
            <div className="tab-content">{tabs[activeTab].content}</div>
        </div>
    );
};

export default Tabs;
