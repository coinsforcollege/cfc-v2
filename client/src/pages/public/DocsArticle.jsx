import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Box, Typography, CircularProgress, Chip } from '@mui/material';
import { Schedule } from '@mui/icons-material';
import { docsApi } from '../../api/docs.api';
import { colors, borderRadius } from '../../utils/designTokens';
import DocsBreadcrumbs from '../../components/docs/DocsBreadcrumbs';
import ArticleListItem from '../../components/docs/ArticleListItem';
import DocsSidebar from '../../components/docs/DocsSidebar';
import DocsContactCTA from '../../components/docs/DocsContactCTA';

const DocsArticle = () => {
  const { categorySlug, articleSlug } = useParams();

  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [categorySlug, articleSlug]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [articleRes, relatedRes, categoriesRes, featuredRes] = await Promise.all([
        docsApi.getArticle(categorySlug, articleSlug),
        docsApi.getRelatedArticles(categorySlug, articleSlug, 3),
        docsApi.getCategories(),
        docsApi.getFeaturedArticles()
      ]);

      if (articleRes.success) {
        setArticle(articleRes.data);
      }

      if (relatedRes.success) {
        setRelatedArticles(relatedRes.data);
      }

      if (categoriesRes.success) {
        setAllCategories(categoriesRes.data);
      }

      if (featuredRes.success) {
        setFeaturedArticles(featuredRes.data);
      }
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    const baseUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
    return image.url?.startsWith('http') ? image.url : `${baseUrl}${image.url}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  if (!article) {
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
          Article not found
        </Typography>
      </Box>
    );
  }

  const breadcrumbs = [
    { label: 'Docs', link: '/docs' },
    { label: article.category?.name || 'Category', link: `/docs/${categorySlug}` },
    { label: article.title, link: `/docs/${categorySlug}/${articleSlug}` }
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
            {/* Article Header */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  color: colors.neutral[900],
                  mb: 2,
                  lineHeight: 1.2,
                  fontSize: { xs: '1.75rem', md: '2.25rem' }
                }}
              >
                {article.title}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                {article.category && (
                  <Chip
                    label={article.category.name}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      background: 'rgba(139, 92, 246, 0.1)',
                      color: '#8b5cf6',
                      border: '1px solid rgba(139, 92, 246, 0.2)'
                    }}
                  />
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Schedule sx={{ fontSize: 14, color: colors.neutral[400] }} />
                  <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                    Updated {formatDate(article.updatedAt)}
                  </Typography>
                </Box>

                {article.readingTime && (
                  <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                    {article.readingTime} min read
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Featured Image */}
            {article.featuredImage && (
              <Box sx={{ mb: 4 }}>
                <Box
                  component="img"
                  src={getImageUrl(article.featuredImage)}
                  alt={article.title}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: borderRadius.md
                  }}
                />
              </Box>
            )}

            {/* Article Content */}
            <Box
              sx={{
                mb: 6,
                '& h1': { fontSize: '2rem', fontWeight: 700, color: colors.neutral[900], mb: 2, mt: 4 },
                '& h2': { fontSize: '1.75rem', fontWeight: 700, color: colors.neutral[900], mb: 2, mt: 3 },
                '& h3': { fontSize: '1.5rem', fontWeight: 600, color: colors.neutral[900], mb: 2, mt: 3 },
                '& h4': { fontSize: '1.25rem', fontWeight: 600, color: colors.neutral[900], mb: 1.5, mt: 2 },
                '& h5': { fontSize: '1.125rem', fontWeight: 600, color: colors.neutral[900], mb: 1.5, mt: 2 },
                '& h6': { fontSize: '1rem', fontWeight: 600, color: colors.neutral[900], mb: 1, mt: 2 },
                '& p': { fontSize: '1.125rem', lineHeight: 1.8, color: colors.neutral[700], mb: 2 },
                '& a': { color: '#8b5cf6', textDecoration: 'underline', '&:hover': { color: '#7c3aed' } },
                '& ul, & ol': { pl: 3, mb: 2, color: colors.neutral[700] },
                '& li': { mb: 1, lineHeight: 1.7 },
                '& blockquote': { borderLeft: '4px solid #8b5cf6', pl: 2, py: 1, my: 3, color: colors.neutral[600], fontStyle: 'italic' },
                '& code': { background: colors.neutral[100], px: 1, py: 0.5, borderRadius: '4px', fontSize: '0.9em', color: '#8b5cf6' },
                '& pre': { background: colors.neutral[100], p: 2, borderRadius: borderRadius.md, overflow: 'auto', mb: 2 },
                '& pre code': { background: 'transparent', p: 0 },
                '& table': { width: '100%', borderCollapse: 'collapse', mb: 3 },
                '& th, & td': { border: `1px solid ${colors.neutral[300]}`, p: 1.5, textAlign: 'left' },
                '& th': { background: colors.neutral[100], fontWeight: 600 },
                '& img': { maxWidth: '100%', height: 'auto', borderRadius: borderRadius.md, my: 2 }
              }}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <Box sx={{ mb: 6 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: colors.neutral[900],
                    mb: 3
                  }}
                >
                  Related Articles
                </Typography>

                {relatedArticles.map((relatedArticle) => (
                  <ArticleListItem
                    key={relatedArticle.id}
                    article={relatedArticle}
                    showCategory={false}
                  />
                ))}
              </Box>
            )}

            {/* Contact CTA */}
            <DocsContactCTA message="Still have questions?" />
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

export default DocsArticle;
