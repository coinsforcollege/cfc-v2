import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { docsApi } from '../../api/docs.api';
import { colors, borderRadius } from '../../utils/designTokens';
import DocsBreadcrumbs from '../../components/docs/DocsBreadcrumbs';
import ArticleListItem from '../../components/docs/ArticleListItem';
import DocsSidebar from '../../components/docs/DocsSidebar';

const DocsSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [results, setResults] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (queryParam) {
      performSearch(queryParam);
    }
    fetchSidebarData();
  }, [queryParam]);

  const fetchSidebarData = async () => {
    try {
      const [categoriesRes, featuredRes] = await Promise.all([
        docsApi.getCategories(),
        docsApi.getFeaturedArticles()
      ]);

      if (categoriesRes.success) {
        setAllCategories(categoriesRes.data);
      }

      if (featuredRes.success) {
        setFeaturedArticles(featuredRes.data);
      }
    } catch (error) {
      console.error('Error fetching sidebar data:', error);
    }
  };

  const performSearch = async (query) => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      const response = await docsApi.searchArticles(query);

      if (response.success) {
        setResults(response.data);
      }
    } catch (error) {
      console.error('Error searching articles:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
    }
  };

  const breadcrumbs = [
    { label: 'Docs', link: '/docs' },
    { label: 'Search Results', link: '/docs/search' }
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
            {/* Search Bar */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: colors.neutral[900],
                  mb: 3,
                  fontSize: { xs: '1.75rem', md: '2.25rem' }
                }}
              >
                Search Documentation
              </Typography>

              <Box component="form" onSubmit={handleSearch}>
                <TextField
                  fullWidth
                  placeholder="Search articles..."
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
                      borderRadius: borderRadius.lg
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Search Results */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : hasSearched ? (
              <>
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.neutral[600],
                    mb: 3,
                    fontWeight: 500
                  }}
                >
                  {results.length} {results.length === 1 ? 'result' : 'results'} found
                  {queryParam && ` for "${queryParam}"`}
                </Typography>

                {results.length > 0 ? (
                  <Box>
                    {results.map((article) => (
                      <ArticleListItem key={article.id} article={article} />
                    ))}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 8,
                      px: 2
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        color: colors.neutral[700],
                        mb: 2,
                        fontWeight: 600
                      }}
                    >
                      No results found
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: colors.neutral[600] }}
                    >
                      Try adjusting your search terms or browse our categories
                    </Typography>
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="body1" sx={{ color: colors.neutral[600] }}>
                  Enter a search term to find articles
                </Typography>
              </Box>
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
              featuredArticles={featuredArticles}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DocsSearch;
