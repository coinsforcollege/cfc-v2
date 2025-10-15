import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { docsApi } from '../../api/docs.api';
import { colors } from '../../utils/designTokens';
import DocsBreadcrumbs from '../../components/docs/DocsBreadcrumbs';
import ArticleListItem from '../../components/docs/ArticleListItem';
import DocsSidebar from '../../components/docs/DocsSidebar';

const DocsFeatured = () => {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [featuredRes, categoriesRes] = await Promise.all([
        docsApi.getFeaturedArticles(),
        docsApi.getCategories()
      ]);

      if (featuredRes.success) {
        setFeaturedArticles(featuredRes.data);
      }

      if (categoriesRes.success) {
        setAllCategories(categoriesRes.data);
      }
    } catch (error) {
      console.error('Error fetching featured articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    { label: 'Docs', link: '/docs' },
    { label: 'Featured Articles', link: '/docs/featured' }
  ];

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
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 3 } }}>
        <DocsBreadcrumbs items={breadcrumbs} />

        {/* Two Column Layout */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4
          }}
        >
          {/* Main Content - 70% */}
          <Box sx={{ flex: { xs: '1', md: '0 0 70%' } }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: colors.neutral[900],
                mb: 4,
                fontSize: { xs: '1.75rem', md: '2.25rem' }
              }}
            >
              Featured Articles
            </Typography>

            {featuredArticles.length > 0 ? (
              <Box>
                {featuredArticles.map((article) => (
                  <ArticleListItem key={article.id} article={article} />
                ))}
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                No featured articles found.
              </Typography>
            )}
          </Box>

          {/* Sidebar - 30% */}
          <Box
            sx={{
              flex: { xs: '1', md: '0 0 30%' },
              display: { xs: 'none', sm: 'block' }
            }}
          >
            <DocsSidebar
              categories={allCategories}
              featuredArticles={[]}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DocsFeatured;
