'use client';

import React from 'react';
import './Banner.css';
import gimg1 from '../Assest/g-img-1.png';
import gimg2 from '../Assest/g-img-2.png';
import gimg3 from '../Assest/g-img-3.png';
import gimg4 from '../Assest/g-img-4.png';
import gimg5 from '../Assest/g-img5.png';

const bannerData = [
  {
    id: 1,
    src: gimg1.src,
    alt: 'Left Top',
    className: 'banner-left-top',
    heading: 'Heading 1',
    subheading: 'Subheading 1',
  },
  {
    id: 2,
    src: gimg2.src,
    alt: 'Left Bottom',
    className: 'banner-left-bottom',
    heading: 'Heading 2',
    subheading: 'Subheading 2',
  },
  {
    id: 3,
    src: gimg3.src,
    alt: 'Center',
    className: 'banner-center',
    heading: 'Heading 3',
    subheading: 'Subheading 3',
  },
  {
    id: 4,
    src: gimg4.src,
    alt: 'Right Top',
    className: 'banner-right-top',
    heading: 'Heading 4',
    subheading: 'Subheading 4',
  },
  {
    id: 5,
    src: gimg5.src,
    alt: 'Right Bottom',
    className: 'banner-right-bottom',
    heading: 'Heading 5',
    subheading: 'Subheading 5',
  },
];

const Bannergrid: React.FC = () => {
  return (
        <div className="banner-container">
    <div className="banner-wrapper">
      {bannerData.map((item) => (
        <div key={item.id} className={`banner-item ${item.className}`}>
          <img src={item.src} alt={item.alt} className="banner-img" />
        </div>
      ))}
    </div>
    </div>
  );
};

export default Bannergrid;
