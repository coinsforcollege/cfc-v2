import React from 'react'
import { Box } from '@mui/material'
import { Outlet, ScrollRestoration } from 'react-router'
import PublicHeader from '../components/layout/PulicHeader'
import Footer from '../components/layout/Footer'

function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <PublicHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </Box>
    </>
  )
}

export default RootLayout