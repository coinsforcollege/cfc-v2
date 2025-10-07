import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Box,
  Typography,
  Chip,
  Avatar,
  CircularProgress,
  Divider,
  Button,
  Card,
  CardContent
} from '@mui/material';
import { 
  CalendarToday, 
  Person, 
  Schedule,
  ArrowBack
} from '@mui/icons-material';
import { blogApi } from '../../api/blog.api';
import { colors, borderRadius } from '../../utils/designTokens';

// Dynamic content components
import RichTextBlock from '../../components/blog/RichTextBlock';
import ImageBlock from '../../components/blog/ImageBlock';
import VideoBlock from '../../components/blog/VideoBlock';
import ImageSliderBlock from '../../components/blog/ImageSliderBlock';
import CTABannerBlock from '../../components/blog/CTABannerBlock';
import QuoteBlock from '../../components/blog/QuoteBlock';
import CommentsSection from '../../components/blog/CommentsSection';
import SubscribeForm from '../../components/blog/SubscribeForm';
import ContactForm from '../../components/blog/ContactForm';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [categoryPosts, setCategoryPosts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (post) {
      fetchSidebarData();
    }
  }, [post]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await blogApi.getPostBySlug(slug);
      if (response.success) {
        setPost(response.data);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const fetchSidebarData = async () => {
    try {
      // Fetch latest posts
      const latestResponse = await blogApi.getPosts({ page: 1, pageSize: 5 });
      if (latestResponse.success) {
        setRelatedPosts(latestResponse.data.filter(p => p.slug !== slug));
      }

      // Fetch posts from same category
      if (post.categories && post.categories.length > 0) {
        const categoryResponse = await blogApi.getPosts({ 
          category: post.categories[0].slug, 
          page: 1, 
          pageSize: 5 
        });
        if (categoryResponse.success) {
          setCategoryPosts(categoryResponse.data.filter(p => p.slug !== slug));
        }
      }

      // Fetch all categories
      const categoriesResponse = await blogApi.getCategories();
      if (categoriesResponse.success) {
        setAllCategories(categoriesResponse.data.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching sidebar data:', error);
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

  const renderContentBlock = (block, index) => {
    const componentMap = {
      'content.text-block': RichTextBlock,
      'content.image': ImageBlock,
      'content.video': VideoBlock,
      'content.image-slider': ImageSliderBlock,
      'content.cta-banner': CTABannerBlock,
      'content.quote': QuoteBlock,
    };

    const Component = componentMap[block.__component];
    
    if (!Component) {
      console.warn(`Unknown component: ${block.__component}`);
      return null;
    }

    return <Component key={index} data={block} getImageUrl={getImageUrl} />;
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        pt: { xs: 12, md: 14 }
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !post) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        pt: { xs: 12, md: 14 },
        px: 2
      }}>
        <Typography variant="h4" color="text.secondary" sx={{ mb: 2 }}>
          {error || 'Post not found'}
        </Typography>
        <Button 
          startIcon={<ArrowBack />}
          onClick={() => navigate('/blog')}
          variant="contained"
          sx={{
            background: colors.neutral[900],
            px: 3,
            py: 1.5,
            fontWeight: 600
          }}
        >
          Back to Blog
        </Button>
      </Box>
    );
  }

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
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/blog')}
          sx={{
            mb: 4,
            color: colors.neutral[600],
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': {
              background: colors.neutral[50],
              color: colors.neutral[900]
            }
          }}
        >
          Back to Blog
        </Button>

        {/* Two Column Layout */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4
        }}>
          {/* Main Content - 70% */}
          <Box sx={{ flex: { xs: '1', md: '0 0 70%' } }}>
            {/* Title */}
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                color: colors.neutral[900],
                lineHeight: 1.2,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              {post.title}
            </Typography>

            {/* Meta Information */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 3,
              pb: 3,
              borderBottom: `1px solid ${colors.neutral[200]}`
            }}>
              {post.author && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {post.author.avatar ? (
                    <Avatar 
                      src={getImageUrl(post.author.avatar)} 
                      sx={{ width: 32, height: 32 }}
                    />
                  ) : (
                    <Avatar sx={{ width: 32, height: 32, background: colors.neutral[400] }}>
                      <Person sx={{ fontSize: 18 }} />
                    </Avatar>
                  )}
                  <Typography variant="body2" sx={{ fontWeight: 500, color: colors.neutral[900] }}>
                    {post.author.name}
                  </Typography>
                </Box>
              )}

              <Typography variant="body2" sx={{ color: colors.neutral[500] }}>•</Typography>

              <Typography variant="body2" sx={{ color: colors.neutral[500] }}>
                {formatDate(post.publishedAt)}
              </Typography>

              {post.readingTime && (
                <>
                  <Typography variant="body2" sx={{ color: colors.neutral[500] }}>•</Typography>
                  <Typography variant="body2" sx={{ color: colors.neutral[500] }}>
                    {post.readingTime} min read
                  </Typography>
                </>
              )}
            </Box>

            {/* Featured Image */}
            {post.featuredImage && (
              <Box sx={{ mb: 4 }}>
                <Box
                  component="img"
                  src={getImageUrl(post.featuredImage)}
                  alt={post.title}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: borderRadius.md
                  }}
                />
              </Box>
            )}

            {/* Dynamic Content Blocks */}
            {post.content && post.content.length > 0 && (
              <Box sx={{ mb: 4 }}>
                {post.content.map((block, index) => renderContentBlock(block, index))}
              </Box>
            )}

            {/* Contact Form - Right after content */}
            {post.contactFormEnabled && (
              <Box sx={{ mb: 4 }}>
                <ContactForm postSlug={slug} />
              </Box>
            )}

            {/* Author Bio */}
            {post.author && post.author.bio && (
              <Box sx={{ 
                py: 4, 
                mb: 4,
                borderTop: `1px solid ${colors.neutral[200]}`,
                borderBottom: `1px solid ${colors.neutral[200]}`
              }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                  {post.author.avatar ? (
                    <Avatar 
                      src={getImageUrl(post.author.avatar)} 
                      sx={{ width: 48, height: 48 }}
                    />
                  ) : (
                    <Avatar sx={{ width: 48, height: 48, background: colors.neutral[400] }}>
                      <Person sx={{ fontSize: 24 }} />
                    </Avatar>
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5, color: colors.neutral[900] }}>
                      {post.author.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.neutral[600], lineHeight: 1.7 }}>
                      {post.author.bio}
                    </Typography>
                  </Box>
                </Box>
              </Box>
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
            {relatedPosts.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: colors.neutral[900] }}>
                  Latest Posts
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {relatedPosts.slice(0, 4).map((relatedPost) => (
                    <Box
                      key={relatedPost.id}
                      onClick={() => navigate(`/blog/${relatedPost.slug}`)}
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
                        {relatedPost.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                        {formatDate(relatedPost.publishedAt)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Category Posts */}
            {categoryPosts.length > 0 && post.categories && post.categories.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: colors.neutral[900] }}>
                  More in {post.categories[0].name}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {categoryPosts.slice(0, 3).map((catPost) => (
                    <Box
                      key={catPost.id}
                      onClick={() => navigate(`/blog/${catPost.slug}`)}
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
                        {catPost.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                        {formatDate(catPost.publishedAt)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Categories */}
            {allCategories.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: colors.neutral[900] }}>
                  Categories
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {allCategories.map((category) => (
                    <Chip
                      key={category.id}
                      label={category.name}
                      onClick={() => navigate(`/blog?category=${category.slug}`)}
                      sx={{
                        justifyContent: 'flex-start',
                        fontWeight: 500,
                        cursor: 'pointer',
                        '&:hover': {
                          background: colors.neutral[100]
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

        {/* Comments Section - Full Width */}
        {post.commentsEnabled && (
          <Box sx={{ 
            mt: 6,
            pt: 6,
            borderTop: `1px solid ${colors.neutral[200]}`
          }}>
            <CommentsSection postSlug={slug} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BlogPost;
