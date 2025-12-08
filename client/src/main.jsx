import { StyledEngineProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n/config'
import App from './App.jsx'

import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <HelmetProvider>
    <StyledEngineProvider enableCssLayer>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <App />
    </StyledEngineProvider>
  </HelmetProvider>
  // </StrictMode>,
)
