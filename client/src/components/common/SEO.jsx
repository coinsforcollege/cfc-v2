import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  image: propImage = 'https://coinsforcollege.org/og_image.png',
  ogImage: propOgImage,
  twitterImage: propTwitterImage,
  url,
  type = 'website',
  imageWidth,
  imageHeight
}) => {
  const siteTitle = 'Coins For College';
  const fullTitle = title ? `${title} | ${siteTitle}` : 'Coins For College - Digital Token Economies for Academic Institutions';
  const siteUrl = 'https://coinsforcollege.org';
  const defaultDescription = 'Turnkey token infrastructure, smart contracts, and full ecosystem deployment on CollegenZ L2. Launch your college\'s digital economy from configuration to go-live in weeks.';
  const metaDescription = description || defaultDescription;
  const metaUrl = url || window.location.href;
  
  // Ensure absolute URL
  const image = propImage.startsWith('http') ? propImage : `${siteUrl}${propImage}`;
  
  const ogImageRaw = propOgImage || image;
  const ogImage = ogImageRaw.startsWith('http') ? ogImageRaw : `${siteUrl}${ogImageRaw}`;
  
  const twitterImageRaw = propTwitterImage || image;
  const twitterImage = twitterImageRaw.startsWith('http') ? twitterImageRaw : `${siteUrl}${twitterImageRaw}`;

  return (
    <Helmet>
      {/* Standard metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      {imageWidth && <meta property="og:image:width" content={imageWidth} />}
      {imageHeight && <meta property="og:image:height" content={imageHeight} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={metaUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={twitterImage} />
    </Helmet>
  );
};

export default SEO;
