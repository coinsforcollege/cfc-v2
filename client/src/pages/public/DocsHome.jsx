import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Button,
  Grid
} from '@mui/material';
import { Search, ArrowForward } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { docsApi } from '../../api/docs.api';
import { colors, borderRadius } from '../../utils/designTokens';
import CategoryCard from '../../components/docs/CategoryCard';
import ArticleListItem from '../../components/docs/ArticleListItem';
import DocsContactCTA from '../../components/docs/DocsContactCTA';

const DocsHome = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [categories, setCategories] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, featuredRes] = await Promise.all([
        docsApi.getCategories(),
        docsApi.getFeaturedArticles()
      ]);

      if (categoriesRes.success) {
        setCategories(categoriesRes.data);
      }

      if (featuredRes.success) {
        setFeaturedArticles(featuredRes.data);
      }
    } catch (error) {
      console.error('Error fetching docs data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/docs/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pt: { xs: 12, md: 14 }
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'white',
        pt: { xs: 12, md: 14 },
        pb: 8
      }}
    >
      {/* Hero Section - Centered */}
      <Box
        sx={{
          maxWidth: '800px',
          mx: 'auto',
          px: { xs: 2, md: 3 },
          textAlign: 'center',
          mb: 8
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            color: colors.neutral[900],
            mb: 2,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          {t('auth.helpAndDocumentation')}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: colors.neutral[600],
            mb: 4,
            lineHeight: 1.6
          }}
        >
          {t('auth.findAnswersGuides')}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          <TextField
            fullWidth
            placeholder={t('auth.searchDocumentation')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: colors.neutral[400] }} />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: borderRadius.lg,
                background: 'white',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
              }
            }}
          />
        </Box>
      </Box>

      {/* Content Section - Full Width */}
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 3 } }}>
        {/* Categories Grid */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: colors.neutral[900],
              mb: 4
            }}
          >
            {t('auth.browseByCategory')}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)'
              },
              gap: 3
            }}
          >
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </Box>
        </Box>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: colors.neutral[900]
                }}
              >
                {t('auth.featuredArticles')}
              </Typography>

              {featuredArticles.length > 6 && (
                <Button
                  onClick={() => navigate('/docs/featured')}
                  endIcon={<ArrowForward />}
                  sx={{
                    color: '#8b5cf6',
                    fontWeight: 600,
                    textTransform: 'none'
                  }}
                >
                  {t('auth.viewAll')}
                </Button>
              )}
            </Box>

            <Box>
              {featuredArticles.slice(0, 6).map((article) => (
                <ArticleListItem key={article.id} article={article} />
              ))}
            </Box>
          </Box>
        )}

        {/* Contact CTA */}
        <DocsContactCTA />
      </Box>
    </Box>
  );
};

export default DocsHome;
