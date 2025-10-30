import React from 'react';
import Header from './components/Header';
import Image from 'next/image';
import Bone from './Assest/B1.jpg';

export default function Home() {
  return (
    <>
      <Header />

      {/* Hero Video */}
      <main style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', paddingTop: '69px' }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: -1, // behind header
          }}
        >
          <source src="/v1.mp4" type="video/mp4" />
          Your browser does not support the video tag.s
        </video>
      </main>
      <div className='div1'>
        <div className='div2'>
            <Image src={Bone} alt="banner 1 " className='bone'/>
 
               <h3 className='lsp-3'>Rugs</h3>
           
            <p className='lsp-3'>View More</p>
            </div>
           
           
      </div>
     
    </>
  );
}
