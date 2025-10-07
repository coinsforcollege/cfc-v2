import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Pagination,
  Avatar,
  Skeleton
} from '@mui/material';
import { Search, CalendarToday, Person, ArrowForward } from '@mui/icons-material';
import { blogApi } from '../../api/blog.api';
import { colors, gradients, borderRadius } from '../../utils/designTokens';
import SubscribeForm from '../../components/blog/SubscribeForm';

const BlogList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);

  useEffect(() => {
    fetchCategories();
    fetchLatestPosts();
  }, []);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedCategory, search]);

  const fetchCategories = async () => {
    try {
      const response = await blogApi.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        pageSize: 9,
      };
      
      if (selectedCategory) params.category = selectedCategory;
      if (search) params.search = search;
      
      const response = await blogApi.getPosts(params);
      if (response.success) {
        setPosts(response.data || []);
        setPagination(response.meta?.pagination || {});
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestPosts = async () => {
    try {
      const response = await blogApi.getPosts({ page: 1, pageSize: 5 });
      if (response.success) {
        setLatestPosts(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching latest posts:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
    updateURL({ search: e.target.value, page: 1 });
  };

  const handleCategoryClick = (categorySlug) => {
    const newCategory = selectedCategory === categorySlug ? '' : categorySlug;
    setSelectedCategory(newCategory);
    setPage(1);
    updateURL({ category: newCategory, page: 1 });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    updateURL({ page: value });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateURL = (params) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
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

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'white',
      pt: { xs: 12, md: 14 },
      pb: 8
    }}>
      <Box sx={{ 
        maxWidth: '1200px', 
        mx: 'auto', 
        px: { xs: 2, md: 3 }
      }}>
        {/* Two Column Layout */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4
        }}>
          {/* Main Content - 70% */}
          <Box sx={{ flex: { xs: '1', md: '0 0 70%' } }}>
            {/* Simple Header */}
            <Box sx={{ mb: 5, borderBottom: `1px solid ${colors.neutral[200]}`, pb: 4 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: colors.neutral[900] }}>
                Latest Stories
              </Typography>
              <Typography variant="body1" sx={{ color: colors.neutral[600] }}>
                Insights and updates from Coins for College
              </Typography>
            </Box>

        {/* Search and Filters */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search articles..."
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: colors.neutral[400] }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: borderRadius.lg,
              }
            }}
          />

          {/* Category Filters */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip
              label="All"
              onClick={() => handleCategoryClick('')}
              variant={!selectedCategory ? 'filled' : 'outlined'}
              sx={{
                fontWeight: 600,
                cursor: 'pointer',
                borderColor: colors.neutral[300],
                ...((!selectedCategory && {
                  background: colors.neutral[900],
                  color: 'white',
                  '&:hover': {
                    background: colors.neutral[800],
                  }
                }))
              }}
            />
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={category.name}
                onClick={() => handleCategoryClick(category.slug)}
                variant={selectedCategory === category.slug ? 'filled' : 'outlined'}
                sx={{
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderColor: colors.neutral[300],
                  ...((selectedCategory === category.slug && {
                    background: colors.neutral[900],
                    color: 'white',
                    '&:hover': {
                      background: colors.neutral[800],
                    }
                  }))
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Blog Posts Grid */}
        {loading ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Card key={n} sx={{ borderRadius: borderRadius['2xl'] }}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={30} width="80%" />
                  <Skeleton variant="text" height={20} width="60%" />
                  <Skeleton variant="text" height={60} />
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="text.secondary">
              No articles found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search or filters
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              mb: 6
            }}>
              {posts.map((post) => (
                <Box 
                  key={post.id}
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    gap: 3,
                    pb: 4,
                    borderBottom: `1px solid ${colors.neutral[200]}`,
                    '&:hover': {
                      '& h6': {
                        color: colors.neutral[600]
                      }
                    }
                  }}
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  <Box sx={{ flex: 1 }}>
                    {/* Title */}
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 1, 
                        color: colors.neutral[900],
                        transition: 'color 0.2s',
                        fontSize: '1.25rem'
                      }}
                    >
                      {post.title}
                    </Typography>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 2,
                          color: colors.neutral[600],
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.6
                        }}
                      >
                        {post.excerpt}
                      </Typography>
                    )}

                    {/* Meta */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      {post.author && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {post.author.avatar ? (
                            <Avatar 
                              src={getImageUrl(post.author.avatar)} 
                              sx={{ width: 20, height: 20 }}
                            />
                          ) : (
                            <Person sx={{ fontSize: 16, color: colors.neutral[400] }} />
                          )}
                          <Typography variant="caption" sx={{ color: colors.neutral[600], fontSize: '0.875rem' }}>
                            {post.author.name}
                          </Typography>
                        </Box>
                      )}
                      <Typography variant="caption" sx={{ color: colors.neutral[500], fontSize: '0.875rem' }}>
                        {formatDate(post.publishedAt)}
                      </Typography>
                      {post.readingTime && (
                        <Typography variant="caption" sx={{ color: colors.neutral[500], fontSize: '0.875rem' }}>
                          {post.readingTime} min read
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {post.featuredImage && (
                    <Box
                      component="img"
                      src={getImageUrl(post.featuredImage)}
                      alt={post.title}
                      sx={{
                        width: 200,
                        height: 134,
                        objectFit: 'cover',
                        borderRadius: borderRadius.md
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>

            {/* Pagination */}
            {pagination?.pageCount > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={pagination.pageCount}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontWeight: 600,
                      borderRadius: borderRadius.lg,
                    },
                    '& .Mui-selected': {
                      background: gradients.primary,
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}
          </Box>

          {/* Sidebar - 30% - Hidden on mobile */}
          <Box sx={{ 
            flex: { xs: '1', md: '0 0 30%' },
            display: { xs: 'none', sm: 'block' },
            position: 'sticky',
            top: 100,
            alignSelf: 'flex-start',
            maxHeight: 'calc(100vh - 120px)',
            overflowY: 'auto'
          }}>
            {/* Latest Posts */}
            {latestPosts.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: colors.neutral[900] }}>
                  Latest Posts
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {latestPosts.slice(0, 4).map((latestPost) => (
                    <Box
                      key={latestPost.id}
                      onClick={() => navigate(`/blog/${latestPost.slug}`)}
                      sx={{
                        cursor: 'pointer',
                        pb: 2,
                        borderBottom: `1px solid ${colors.neutral[200]}`,
                        '&:hover h6': {
                          color: colors.neutral[600]
                        }
                      }}
                    >
                      <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, mb: 0.5, transition: 'color 0.2s' }}>
                        {latestPost.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                        {formatDate(latestPost.publishedAt)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Categories */}
            {categories.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: colors.neutral[900] }}>
                  Categories
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {categories.slice(0, 6).map((category) => (
                    <Chip
                      key={category.id}
                      label={category.name}
                      onClick={() => handleCategoryClick(category.slug)}
                      sx={{
                        justifyContent: 'flex-start',
                        fontWeight: 500,
                        cursor: 'pointer',
                        ...(selectedCategory === category.slug && {
                          background: colors.neutral[900],
                          color: 'white',
                        }),
                        '&:hover': {
                          background: selectedCategory === category.slug ? colors.neutral[800] : colors.neutral[100]
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Subscribe in Sidebar */}
            <SubscribeForm />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BlogList;

