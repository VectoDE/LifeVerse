import React, { useState } from 'react';

const ImageGallery: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const images = [
        '/images/gallery1.jpg',
        '/images/gallery2.jpg',
        '/images/gallery3.jpg',
        '/images/gallery4.jpg',
        '/images/gallery5.jpg',
        '/images/gallery6.jpg',
    ];

    const openImage = (image: string) => {
        setSelectedImage(image);
    };

    const closeImage = () => {
        setSelectedImage(null);
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <h2 className="text-3xl font-bold text-center mb-8">Unsere Bildgalerie</h2>

            {/* Image Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="relative group cursor-pointer"
                        onClick={() => openImage(image)}
                    >
                        <img
                            src={image}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-auto rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
                        />
                        {/* Optional: Overlay on hover */}
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-lg"></div>
                    </div>
                ))}
            </div>

            {/* Modal to show selected image */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="relative">
                        <img
                            src={selectedImage}
                            alt="Selected"
                            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
                        />
                        <button
                            onClick={closeImage}
                            className="absolute top-4 right-4 text-white text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
