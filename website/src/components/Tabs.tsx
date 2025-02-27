import React, { useState } from 'react';

interface TabsProps {
    tabs: { label: string; content: React.ReactNode }[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            <div className="flex border-b">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`py-2 px-4 text-sm font-medium ${index === activeTab
                                ? 'border-b-2 border-blue-500 text-blue-500'
                                : 'text-gray-500 hover:text-blue-500'
                            }`}
                        onClick={() => setActiveTab(index)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="mt-4">{tabs[activeTab].content}</div>
        </div>
    );
};

export default Tabs;
