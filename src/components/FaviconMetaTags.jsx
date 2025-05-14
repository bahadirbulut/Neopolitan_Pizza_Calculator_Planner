// filepath: c:\Users\0034474\OneDrive - DEME\Desktop\Neopolitan_Pizza_Calculator_Planner\src\components\FaviconMetaTags.jsx
import React from 'react';

/**
 * Component that includes all favicon and meta tags for the app
 * This is used in index.html
 */
const FaviconMetaTags = () => {
  return (
    <>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#e63946" />
      <meta name="msapplication-TileColor" content="#e63946" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="description" content="Neapolitan Pizza Dough Calculator based on AVPN guidelines" />
    </>
  );
};

export default FaviconMetaTags;