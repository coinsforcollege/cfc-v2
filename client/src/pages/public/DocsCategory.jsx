import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Box, Typography, CircularProgress } from '@mui/material';
import { docsApi } from '../../api/docs.api';
import { colors } from '../../utils/designTokens';
import DocsBreadcrumbs from '../../components/docs/DocsBreadcrumbs';
import ArticleListItem from '../../components/docs/ArticleListItem';
import DocsSidebar from '../../components/docs/DocsSidebar';
import DocsContactCTA from '../../components/docs/DocsContactCTA';

const DocsCategory = () => {
  const { categorySlug } = useParams();

  const [category, setCategory] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [categorySlug]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoryRes, categoriesRes, featuredRes] = await Promise.all([
        docsApi.getCategoryBySlug(categorySlug),
        docsApi.getCategories(),
        docsApi.getFeaturedArticles()
      ]);

      if (categoryRes.success) {
        setCategory(categoryRes.data);
      }

      if (categoriesRes.success) {
        setAllCategories(categoriesRes.data);
      }

      if (featuredRes.success) {
        setFeaturedArticles(featuredRes.data);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    } finally {
      setLoading(false);
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

  if (!category) {
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
        <Typography variant="h5" color="text.secondary">
          Category not found
        </Typography>
      </Box>
    );
  }

  const breadcrumbs = [
    { label: 'Docs', link: '/docs' },
    { label: category.name, link: `/docs/${categorySlug}` }
  ];

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
            {/* Category Header */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: colors.neutral[900],
                  mb: 2,
                  fontSize: { xs: '1.75rem', md: '2.25rem' }
                }}
              >
                {category.name}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: colors.neutral[600],
                  lineHeight: 1.6
                }}
              >
                {category.description}
              </Typography>
            </Box>

            {/* Articles List */}
            {category.articles && category.articles.length > 0 ? (
              <Box>
                {category.articles.map((article) => (
                  <ArticleListItem
                    key={article.id}
                    article={article}
                    showCategory={false}
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                No articles found in this category.
              </Typography>
            )}

            {/* Contact CTA */}
            <DocsContactCTA />
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
              currentCategorySlug={categorySlug}
              featuredArticles={featuredArticles}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DocsCategory;
