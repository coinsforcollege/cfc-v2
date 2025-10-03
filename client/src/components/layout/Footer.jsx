import React from 'react';
import { Box, Container, Typography, Link, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import { APP_CONFIG } from '../../constants';

export default function DarkFooter() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#121212',
        color: '#ffffff',
        py: 2,
        borderTop: '1px solid #333',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: '#aaa' }}>
            © {APP_CONFIG.foundedYear} {APP_CONFIG.companyName}. All rights reserved.
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            <Link
              href={APP_CONFIG.links.privacy}
              underline="none"
              sx={{
                color: '#aaa',
                '&:hover': { color: '#fff' },
                fontSize: '0.875rem'
              }}
            >
              Privacy
            </Link>
            <Link
              href={APP_CONFIG.links.terms}
              underline="none"
              sx={{
                color: '#aaa',
                '&:hover': { color: '#fff' },
                fontSize: '0.875rem'
              }}
            >
              Terms
            </Link>
            <Link
              href={APP_CONFIG.links.contact}
              underline="none"
              sx={{
                color: '#aaa',
                '&:hover': { color: '#fff' },
                fontSize: '0.875rem'
              }}
            >
              Contact
            </Link>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              sx={{ color: '#aaa', '&:hover': { color: '#fff' } }}
              href={APP_CONFIG.socialLinks.github}
            >
              <GitHubIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              sx={{ color: '#aaa', '&:hover': { color: '#fff' } }}
              href={APP_CONFIG.socialLinks.twitter}
            >
              <TwitterIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              sx={{ color: '#aaa', '&:hover': { color: '#fff' } }}
              href={APP_CONFIG.socialLinks.linkedin}
            >
              <LinkedInIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              sx={{ color: '#aaa', '&:hover': { color: '#fff' } }}
              href={APP_CONFIG.socialLinks.email}
            >
              <EmailIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}