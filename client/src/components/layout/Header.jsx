import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { AppBar, Button, Box, Dialog, DialogTitle, DialogContent, IconButton, Typography, useMediaQuery, useTheme, CircularProgress } from '@mui/material';
import { Close as CloseIcon, Menu as MenuIcon, School as SchoolIcon, Business as BusinessIcon } from '@mui/icons-material';

const Header = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStartedClick = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (path) => {
    setLoading(true);
    setPopupOpen(false);
    // Simulate loading time
    setTimeout(() => {
      window.location.href = path;
    }, 500);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          height: '64px',
          zIndex: 1000,
          background: scrolled 
            ? 'rgba(250, 250, 252, 0.1)' 
            : 'rgba(250, 250, 252, 0.05)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled 
            ? '1px solid rgba(0, 0, 0, 0.08)' 
            : 'none',
          boxShadow: scrolled 
            ? '0 4px 20px rgba(0, 0, 0, 0.1)' 
            : 'none',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Box sx={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: '24px',
          paddingRight: '24px',
        }}>
          {/* Logo */}
          <Link 
            to="/" 
            style={{ 
              textDecoration: 'none', 
              color: '#111827', 
              fontWeight: '900', 
              fontSize: '1.25rem',
              textTransform: 'uppercase',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              background: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.5px',
            }}
          >
            Coins For College
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: '24px' }}>
              <Link 
                to="/student/build-on-collegen" 
                style={{ 
                  textDecoration: 'none', 
                  color: '#111827', 
                  fontSize: '0.95rem',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => e.target.style.color = '#0EA5E9'}
                onMouseLeave={(e) => e.target.style.color = '#111827'}
              >
                For Students
              </Link>
              <Link 
                to="/how-it-works/colleges" 
                style={{ 
                  textDecoration: 'none', 
                  color: '#111827', 
                  fontSize: '0.95rem',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => e.target.style.color = '#0EA5E9'}
                onMouseLeave={(e) => e.target.style.color = '#111827'}
              >
                For Colleges
              </Link>
              <Link 
                to="/#network-map" 
                style={{ 
                  textDecoration: 'none', 
                  color: '#111827', 
                  fontSize: '0.95rem',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => e.target.style.color = '#0EA5E9'}
                onMouseLeave={(e) => e.target.style.color = '#111827'}
              >
                Network Map
              </Link>
            </Box>
          )}

          {/* Desktop Auth Buttons */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: '12px' }}>
              <Button
                variant="outlined"
                component={Link}
                to="/auth/login"
                sx={{ 
                  textTransform: 'none',
                  borderRadius: '8px',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: '#ffffff',
                  background: 'rgba(14, 165, 233, 0.8)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    borderColor: '#ffffff',
                    background: 'rgba(2, 132, 199, 0.9)',
                  },
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={handleGetStartedClick}
                sx={{ 
                  textTransform: 'none',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
                  color: '#ffffff',
                  boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0284C7 0%, #7C3AED 100%)',
                    boxShadow: '0 6px 20px rgba(14, 165, 233, 0.6)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Get Started
              </Button>
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              onClick={toggleMobileMenu}
              sx={{ color: '#111827' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </AppBar>

      {/* Mobile Side Menu */}
      {isMobile && mobileMenuOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1300,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={toggleMobileMenu}
        >
          <Box
            sx={{
              width: '75%',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
              backdropFilter: 'blur(20px)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: '700', textTransform: 'uppercase' }}>
                Menu
              </Typography>
              <IconButton onClick={toggleMobileMenu}>
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Link 
                to="/student/build-on-collegen" 
                style={{ textDecoration: 'none', color: '#374151', fontSize: '1.1rem' }}
                onClick={toggleMobileMenu}
              >
                For Students
              </Link>
              <Link 
                to="/how-it-works/colleges" 
                style={{ textDecoration: 'none', color: '#374151', fontSize: '1.1rem' }}
                onClick={toggleMobileMenu}
              >
                For Colleges
              </Link>
              <Link 
                to="/#network-map" 
                style={{ textDecoration: 'none', color: '#374151', fontSize: '1.1rem' }}
                onClick={toggleMobileMenu}
              >
                Network Map
              </Link>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
              <Button
                variant="outlined"
                component={Link}
                to="/auth/login"
                fullWidth
                sx={{ 
                  textTransform: 'none',
                  borderRadius: '8px',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: '#374151',
                }}
                onClick={toggleMobileMenu}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  handleGetStartedClick();
                  toggleMobileMenu();
                }}
                fullWidth
                sx={{ 
                  textTransform: 'none',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
                  color: '#ffffff',
                }}
              >
                Get Started
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Get Started Popup */}
      <Dialog
        open={popupOpen}
        onClose={handleClosePopup}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: '700',
        }}>
          Join Our Community
          <IconButton onClick={handleClosePopup} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ padding: '32px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* College Option */}
            <Box
              sx={{
                padding: '24px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)',
                border: '1px solid rgba(14, 165, 233, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(14, 165, 233, 0.3)',
                  border: '1px solid rgba(14, 165, 233, 0.4)',
                }
              }}
              onClick={() => handleNavigation('/auth/register/admin')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                <Box sx={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
                }}>
                  <BusinessIcon sx={{ color: 'white', fontSize: '24px' }} />
                </Box>
                <Typography variant="h5" sx={{ color: '#0EA5E9', fontWeight: '700' }}>
                  For Colleges
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.6, fontSize: '1rem' }}>
                Join our waitlist for free and start building your campus economy with blockchain technology.
              </Typography>
              <Box sx={{ 
                position: 'absolute', 
                top: '16px', 
                right: '16px',
                width: '60px',
                height: '60px',
                opacity: 0.1,
                backgroundImage: 'url(/images/collegen-icon-blue-transparent-bg.svg)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }} />
            </Box>

            {/* Student Option */}
            <Box
              sx={{
                padding: '24px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(139, 92, 246, 0.3)',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                }
              }}
              onClick={() => handleNavigation('/auth/register/student')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                <Box sx={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                }}>
                  <SchoolIcon sx={{ color: 'white', fontSize: '24px' }} />
                </Box>
                <Typography variant="h5" sx={{ color: '#8B5CF6', fontWeight: '700' }}>
                  For Students
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#374151', lineHeight: 1.6, fontSize: '1rem' }}>
                Start mining your college token and earn rewards while supporting your campus community.
              </Typography>
              <Box sx={{ 
                position: 'absolute', 
                top: '16px', 
                right: '16px',
                width: '60px',
                height: '60px',
                opacity: 0.1,
                backgroundImage: 'url(/images/collegen-icon-blue-transparent-bg.svg)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }} />
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Loading Overlay */}
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <CircularProgress 
              size={40} 
              sx={{ 
                color: '#0EA5E9',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }} 
            />
            <Typography variant="body1" sx={{ color: '#374151', fontWeight: '500' }}>
              Redirecting you...
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Header;
