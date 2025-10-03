import React from 'react'
import { Box } from '@mui/material'
import { Outlet, ScrollRestoration } from 'react-router'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </Box>
    </>
  )
}

export default RootLayout