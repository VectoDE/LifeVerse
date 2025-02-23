import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/Breadcrumbs.css';

interface Breadcrumb {
    label: string;
    path: string;
}

interface BreadcrumbsProps {
    breadcrumbs: Breadcrumb[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs }) => {
    return (
        <nav className="breadcrumbs">
            {breadcrumbs.map((breadcrumb, index) => (
                <span key={index} className="breadcrumb-item">
                    {index > 0 && <span className="separator"> &gt; </span>}
                    <Link to={breadcrumb.path} className="breadcrumb-link">
                        {breadcrumb.label}
                    </Link>
                </span>
            ))}
        </nav>
    );
};

export default Breadcrumbs;
