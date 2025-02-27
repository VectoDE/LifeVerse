import React, { useState } from 'react';

interface Tab {
    label: string;
    content: React.ReactNode;
}

interface TabAccordionProps {
    tabs: Tab[];
}

const TabAccordion: React.FC<TabAccordionProps> = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState<number>(0);

    const handleTabClick = (index: number) => {
        if (activeTab === index) {
            setActiveTab(-1);
        } else {
            setActiveTab(index);
        }
    };

    return (
        <div className="space-y-4">
            {tabs.map((tab, index) => (
                <div key={index} className="border border-gray-300 rounded-lg">
                    <div
                        className="flex items-center justify-between p-4 bg-gray-200 cursor-pointer"
                        onClick={() => handleTabClick(index)}
                    >
                        <span className="text-lg font-semibold">{tab.label}</span>
                        <span
                            className={`transform transition-all duration-200 ${activeTab === index ? 'rotate-180' : ''
                                }`}
                        >
                            &#9660; {/* Down Arrow */}
                        </span>
                    </div>

                    {activeTab === index && (
                        <div className="p-4 bg-gray-50">
                            {tab.content}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TabAccordion;
