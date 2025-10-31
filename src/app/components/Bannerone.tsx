import React from "react";
import Bone from '../Assest/B1.jpg';
import Image from 'next/image'; 
import './Banner.css'

export default function Bannerone() {
    return (
        <div className='div2'>
            <Image src={Bone} alt="banner 1 " className='bone' />

            <h3 className='lsp-3'>Rugs</h3>

            <p className='lsp-3'>View More</p>
        </div>
    );
}