'use client';

import { useState } from 'react';
import '../Toggle.css'
import WomensBannerCard from './WomensBannerCard';
import MensBannerCard from './MensBannerCard';
import Bannergridwomens from './Bannergridwomens';
import Bannergridmens from './Bannergridmens';

const BannerToggle = () => {
    const [selected, setSelected] = useState<'women' | 'men'>('women');

    const btnStyle = (isSelected: boolean) => ({
        width: '170px',
        padding: '12px 0',
        border: '2px solid #D2BD50',
        cursor: 'pointer',
        fontFamily: 'Lora',
        backgroundColor: isSelected ? '#D2BD50' : '#ffffff',
        color: isSelected ? '#ffffff' : '#D2BD50',
        fontSize: '18px',
        fontWeight: 600,
        borderRadius: '0px',
        textAlign: 'center' as const,
        transition: 'all 0.3s ease',
    });

    return (
        <div className="banner-toggle-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '0px', alignItems: 'center', width: '100%'}}>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0px', }}>
                <button onClick={() => setSelected('women')} style={btnStyle(selected === 'women')}>
                    Women
                </button>
                <button onClick={() => setSelected('men')} style={btnStyle(selected === 'men')}>
                    Men
                </button>
            </div>

            {/* Banner Section */}
            <div>
                {selected === 'women' ? (
                    <div className="banner_sections" >
                    <WomensBannerCard /> 
                    </div>
                ) : (
                    <div className="banner_sections">
                    <MensBannerCard/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BannerToggle;