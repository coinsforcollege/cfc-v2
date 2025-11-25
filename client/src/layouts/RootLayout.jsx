import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import AnnouncementBanner from '../components/AnnouncementBanner'
import { trackPageView } from '../utils/fbPixel'

function RootLayout() {
  const location = useLocation();

  useEffect(() => {
    trackPageView();
  }, [location]);

  return (
    <>
      <ScrollRestoration />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <AnnouncementBanner />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </Box>
    </>
  )
}

export default RootLayout