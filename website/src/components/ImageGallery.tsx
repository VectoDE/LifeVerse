import React from 'react';
import '../assets/styles/ImageGallery.css';

interface ImageGalleryProps {
    images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
    return (
        <div className="image-gallery">
            {images.map((image, index) => (
                <div key={index} className="image-item">
                    <img src={image} alt={`Gallery item ${index + 1}`} />
                </div>
            ))}
        </div>
    );
};

export default ImageGallery;
