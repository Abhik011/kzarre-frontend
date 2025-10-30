import React, { ReactNode } from 'react';
import './globals.css'; // relative path to globals.css
import './Toggle.css'; // relative path to globals.css
import Header from './components/Header';
import BannerToggle from './components/BannerToggle';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <BannerToggle />
          <br/>
         <h1>jkabdjasjhsvjhdvkhjv</h1>

      </body>
    </html>
  );
}
