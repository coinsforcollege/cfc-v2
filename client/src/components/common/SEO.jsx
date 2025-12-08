import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  image: propImage = 'https://coinsforcollege.org/og_image.png',
  url,
  type = 'website'
}) => {
  const siteTitle = 'Coins For College';
  const fullTitle = title ? `${title} | ${siteTitle}` : 'Coins For College - Digital Token Economies for Academic Institutions';
  const siteUrl = 'https://coinsforcollege.org';
  const defaultDescription = 'Turnkey token infrastructure, smart contracts, and full ecosystem deployment on CollegenZ L2. Launch your college\'s digital economy from configuration to go-live in weeks.';
  const metaDescription = description || defaultDescription;
  const metaUrl = url || window.location.href;
  
  // Ensure absolute URL
  const image = propImage.startsWith('http') ? propImage : `${siteUrl}${propImage}`;

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
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={metaUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
