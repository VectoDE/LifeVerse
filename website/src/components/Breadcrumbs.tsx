import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbsProps {
    breadcrumbs: { label: string; path: string }[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs }) => {
    return (
        <nav aria-label="Breadcrumb" className="bg-gray-100 p-4 rounded-md shadow-sm">
            <ol className="list-none flex space-x-2">
                {breadcrumbs.map((breadcrumb, index) => (
                    <li key={index} className="flex items-center">
                        {index < breadcrumbs.length - 1 ? (
                            <>
                                <Link to={breadcrumb.path} className="text-blue-600 hover:text-blue-800">
                                    {breadcrumb.label}
                                </Link>
                                <span className="mx-2 text-gray-600">/</span>
                            </>
                        ) : (
                            <span className="text-gray-500">{breadcrumb.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
