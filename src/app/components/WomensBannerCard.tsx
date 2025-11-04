'use client';

import React from 'react';
import Image from 'next/image';

// Import local images
import Women1 from '../Assest/womens.png';
import Women2 from '../Assest/womens.png';
import Women3 from '../Assest/womens.png';
import Women4 from '../Assest/womens.png';

const WomensBannerCard: React.FC = () => {
  const banners = [
    { image: Women1, heading: 'Elegant Dress', subheading: 'View More' },
    { image: Women2, heading: 'Summer Outfit', subheading: 'View More' },
    { image: Women3, heading: 'Casual Wear', subheading: 'View More' },
    { image: Women4, heading: 'Evening Gown', subheading: 'View More' },
  ];

  return (
    <div className="four-image-grid-wrapper">
      {banners.map((banner, index) => (
        <div key={index} className="grid-item">
          <Image
            src={banner.image}
            alt={banner.heading}
            width={410}     // ✅ must provide width
            height={668}    // ✅ must provide height
            className="grid-image"
          />
          <div className="grid-text lsp-3">
            <h3>{banner.heading}</h3>
            <p>{banner.subheading}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WomensBannerCard;
