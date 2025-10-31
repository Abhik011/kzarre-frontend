import React, { ReactNode } from 'react';
import './globals.css'; // relative path to globals.css
import './Toggle.css'; // relative path to globals.css
import Header from './components/Header';
import Footer from './components/Footer';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
<Footer/>
      </body>
    </html>
  );
}
