import axios from 'axios';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// Create axios instance for Strapi
const strapiClient = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: STRAPI_API_TOKEN ? {
    'Authorization': `Bearer ${STRAPI_API_TOKEN}`
  } : {}
});

// Get all blog posts with filters
export const getPosts = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, category, tag, search, featured } = req.query;
    
    const filters = {};
    if (category) filters.categories = { slug: { $eq: category } };
    if (tag) filters.tags = { slug: { $eq: tag } };
    if (search) filters.title = { $containsi: search };
    if (featured === 'true') filters.featured = true;
    
    const response = await strapiClient.get('/blog-posts', {
      params: {
        'filters[publishedAt][$notNull]': true,
        ...Object.entries(filters).reduce((acc, [key, value]) => ({
          ...acc,
          [`filters[${key}]`]: value
        }), {}),
        'populate[featuredImage]': true,
        'populate[author][populate][avatar]': true,
        'populate[categories]': true,
        'populate[tags]': true,
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
        'sort': 'publishedAt:desc'
      }
    });
    
    console.log('Strapi response:', JSON.stringify(response.data, null, 2));
    
    res.json({
      success: true,
      data: response.data.results || response.data.data || [],
      meta: { 
        pagination: response.data.pagination || response.data.meta?.pagination || { page: 1, pageSize: 9, pageCount: 0, total: 0 }
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error.message);
    console.error('Full error:', error.response?.data || error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog posts'
    });
  }
};

// Get single blog post by slug
export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const response = await strapiClient.get('/blog-posts', {
      params: {
        'filters[slug][$eq]': slug,
        'filters[publishedAt][$notNull]': true,
        'populate[featuredImage]': true,
        'populate[author][populate][avatar]': true,
        'populate[categories]': true,
        'populate[tags]': true,
        'populate[seo][populate][ogImage]': true,
        'populate[content][on][content.image][populate]': 'image',
        'populate[content][on][content.image-slider][populate]': 'images',
        'populate[content][on][content.text-block]': true,
        'populate[content][on][content.video]': true,
        'populate[content][on][content.cta-banner]': true,
        'populate[content][on][content.quote]': true
      }
    });
    
    const results = response.data.results || response.data.data || [];
    
    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    // Debug: Log the content blocks to see their structure
    console.log('Post content blocks:', JSON.stringify(results[0].content, null, 2));
    
    res.json({
      success: true,
      data: results[0]
    });
  } catch (error) {
    console.error('Error fetching blog post:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog post'
    });
  }
};

// Get categories
export const getCategories = async (req, res) => {
  try {
    const response = await strapiClient.get('/categories');
    
    res.json({
      success: true,
      data: response.data.results || response.data.data || []
    });
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
};

// Get tags
export const getTags = async (req, res) => {
  try {
    const response = await strapiClient.get('/tags');
    
    res.json({
      success: true,
      data: response.data.results || response.data.data || []
    });
  } catch (error) {
    console.error('Error fetching tags:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tags'
    });
  }
};

// Get authors
export const getAuthors = async (req, res) => {
  try {
    const response = await strapiClient.get('/authors', {
      params: {
        'populate[avatar]': true
      }
    });
    
    res.json({
      success: true,
      data: response.data.results || response.data.data || []
    });
  } catch (error) {
    console.error('Error fetching authors:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch authors'
    });
  }
};

// Get comments for a post
export const getComments = async (req, res) => {
  try {
    const { slug } = req.params;
    
    // First get the post ID by slug
    const postResponse = await strapiClient.get('/blog-posts', {
      params: {
        'filters[slug][$eq]': slug,
        'filters[publishedAt][$notNull]': true
      }
    });
    
    const postResults = postResponse.data.results || postResponse.data.data || [];
    
    if (!postResults || postResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    const postId = postResults[0].id;
    
    // Get comments for this post
    const commentsResponse = await strapiClient.get('/comments', {
      params: {
        'filters[blog_post][id][$eq]': postId,
        'filters[approved][$eq]': true,
        'filters[parentComment][$null]': true,
        'populate[replies][populate][replies]': true,
        'sort': 'createdAt:desc'
      }
    });
    
    res.json({
      success: true,
      data: commentsResponse.data.results || commentsResponse.data.data || []
    });
  } catch (error) {
    console.error('Error fetching comments:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments'
    });
  }
};

// Create a comment
export const createComment = async (req, res) => {
  try {
    const { slug } = req.params;
    const { content, authorName, authorEmail, parentCommentId } = req.body;
    
    if (!content || !authorName || !authorEmail) {
      return res.status(400).json({
        success: false,
        message: 'Content, author name, and email are required'
      });
    }
    
    // Get the post ID by slug
    const postResponse = await strapiClient.get('/blog-posts', {
      params: {
        'filters[slug][$eq]': slug,
        'filters[publishedAt][$notNull]': true
      }
    });
    
    const postResults = postResponse.data.results || postResponse.data.data || [];
    
    if (!postResults || postResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    const postId = postResults[0].id;
    
    // Create comment
    const commentData = {
      content,
      authorName,
      authorEmail,
      blog_post: postId,
      approved: false, // Requires approval
      ipAddress: req.ip
    };
    
    if (parentCommentId) {
      commentData.parentComment = parentCommentId;
    }
    
    const response = await strapiClient.post('/comments', {
      data: commentData
    });
    
    res.status(201).json({
      success: true,
      message: 'Comment submitted successfully and is awaiting approval',
      data: response.data.data || response.data
    });
  } catch (error) {
    console.error('Error creating comment:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create comment'
    });
  }
};

// Subscribe to newsletter
export const subscribe = async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    const response = await strapiClient.post('/subscribers', {
      data: {
        email,
        name
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: response.data.data || response.data
    });
  } catch (error) {
    if (error.response?.status === 400) {
      return res.status(400).json({
        success: false,
        message: error.response.data.error?.message || 'Already subscribed'
      });
    }
    
    console.error('Error subscribing:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe'
    });
  }
};

// Contact form submission
export const contactSubmission = async (req, res) => {
  try {
    const { name, email, subject, message, postSlug } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }
    
    const contactData = {
      name,
      email,
      subject,
      message,
      ipAddress: req.ip
    };
    
    // If postSlug is provided, link to the post
    if (postSlug) {
      const postResponse = await strapiClient.get('/blog-posts', {
        params: {
          'filters[slug][$eq]': postSlug,
          'filters[publishedAt][$notNull]': true
        }
      });
      
      const postResults = postResponse.data.results || postResponse.data.data || [];
      
      if (postResults && postResults.length > 0) {
        contactData.blog_post = postResults[0].id;
      }
    }
    
    const response = await strapiClient.post('/contact-submissions', {
      data: contactData
    });
    
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: response.data.data || response.data
    });
  } catch (error) {
    console.error('Error submitting contact form:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form'
    });
  }
};

// Get all subscribers (admin only)
export const getSubscribers = async (req, res) => {
  try {
    const response = await strapiClient.get('/subscribers', {
      params: {
        'pagination[pageSize]': 1000,
        'sort': 'createdAt:desc'
      }
    });
    
    res.json({
      success: true,
      data: response.data.results || response.data.data || []
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscribers'
    });
  }
};

// Delete subscriber (admin only)
export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    
    await strapiClient.delete(`/subscribers/${id}`);
    
    res.json({
      success: true,
      message: 'Subscriber deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subscriber:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete subscriber'
    });
  }
};

