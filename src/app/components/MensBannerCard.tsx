'use client';

import React from 'react';
import Image from 'next/image';
import './FourImageGrid.css';

// Import local images
import Men1 from '../Assest/men.png';
import Men2 from '../Assest/men.png';
import Men3 from '../Assest/men.png';
import Men4 from '../Assest/men.png';

const MensBannerCard: React.FC = () => {
  const banners = [
    { image: Men1, heading: 'Casual Shirt', subheading: 'View More' },
    { image: Men2, heading: 'Jeans', subheading: 'View More' },
    { image: Men3, heading: 'Jacket', subheading: 'View More' },
    { image: Men4, heading: 'Shoes', subheading: 'View More' },
  ];

  return (
    <div className="four-image-grid-wrapper">
      {banners.map((banner, index) => (
        <div key={index} className="grid-item">
          <Image src={banner.image} alt={banner.heading} className="grid-image" />
          <div className="grid-text lsp-3">
            <h3>{banner.heading}</h3>
            <p>{banner.subheading}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MensBannerCard;
