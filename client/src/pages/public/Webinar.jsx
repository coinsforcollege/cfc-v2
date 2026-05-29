import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import SEO from '../../components/common/SEO';
import WebinarIndia from '../../components/sections/webinar/india';
import WebinarGlobal from '../../components/sections/webinar/global';

const Webinar = () => {
  const [isIndia, setIsIndia] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Detect location using timezone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone && (timeZone.includes('Asia/Calcutta') || timeZone.includes('Asia/Kolkata'))) {
      setIsIndia(true);
    }
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by waiting for mount
  if (!mounted) {
    return <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }} />;
  }

  return (
    <Box>
      <SEO 
        title={isIndia ? "The 2030 India Enrollment Opportunity" : "The Class of 2030 is in eighth grade right now"}
        description={isIndia 
          ? "A ninety-minute research briefing for growth-oriented Indian universities." 
          : "They have already begun deciding which colleges exist. A briefing on the structural shift."}
      />
      {isIndia ? <WebinarIndia /> : <WebinarGlobal />}
    </Box>
  );
};

export default Webinar;
