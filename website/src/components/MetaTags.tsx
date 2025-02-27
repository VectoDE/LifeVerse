import React from 'react';
import { Helmet } from 'react-helmet';

interface MetaTagsProps {
    title?: string;
    description?: string;
    keywords?: string;
    author?: string;
    image?: string;
    url?: string;
    children: React.ReactNode;
}

export const MetaTags: React.FC<MetaTagsProps> = ({
    title,
    description,
    keywords,
    author,
    image,
    url,
    children,
}) => {
    return (
        <>
            <Helmet>
                {/* Title Tag */}
                <title>{title}</title>

                {/* Meta Description */}
                <meta name="description" content={description} />

                {/* Meta Keywords */}
                <meta name="keywords" content={keywords} />

                {/* Meta Author */}
                <meta name="author" content={author} />

                {/* Open Graph Meta Tags */}
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:type" content="website" />
                <meta property="og:image" content={image} />
                <meta property="og:url" content={url} />

                {/* Twitter Card Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={image} />
                <meta name="twitter:url" content={url} />

                {/* Viewport Meta Tag */}
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                {/* Favicon */}
                <link rel="icon" href="/favicon.ico" />
            </Helmet>
            {children}
        </>
    );
};
