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

// Get all categories with article counts
export const getCategories = async (req, res) => {
  try {
    const response = await strapiClient.get('/doc-categories', {
      params: {
        'populate[doc_articles]': true,
        'sort': 'order:asc'
      }
    });

    const rawCategories = response.data.results || response.data.data || [];

    // Transform to include article count
    const categories = rawCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      order: cat.order,
      articleCount: cat.doc_articles?.length || 0
    }));

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching doc categories:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch documentation categories'
    });
  }
};

// Get single category by slug with articles
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const response = await strapiClient.get('/doc-categories', {
      params: {
        'filters[slug][$eq]': slug,
        'populate[doc_articles][populate][category]': true,
        'populate[doc_articles][populate][featuredImage]': true,
        'populate[doc_articles][sort]': 'updatedAt:desc'
      }
    });

    const results = response.data.results || response.data.data || [];

    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const category = results[0];

    // Filter only published articles
    const articles = (category.doc_articles || [])
      .filter(article => article.publishedAt)
      .map(article => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        readingTime: article.readingTime,
        viewCount: article.viewCount,
        featured: article.featured,
        updatedAt: article.updatedAt,
        category: article.category ? {
          id: article.category.id,
          name: article.category.name,
          slug: article.category.slug
        } : null,
        featuredImage: article.featuredImage
      }));

    res.json({
      success: true,
      data: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        articles
      }
    });
  } catch (error) {
    console.error('Error fetching category:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category'
    });
  }
};

// Get single article by category slug and article slug
export const getArticle = async (req, res) => {
  try {
    const { categorySlug, articleSlug } = req.params;

    const response = await strapiClient.get('/doc-articles', {
      params: {
        'filters[slug][$eq]': articleSlug,
        'filters[publishedAt][$notNull]': true,
        'populate[category]': true,
        'populate[featuredImage]': true,
        'populate[ogImage]': true
      }
    });

    const results = response.data.results || response.data.data || [];

    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    const article = results[0];

    // Verify category slug matches
    if (article.category && article.category.slug !== categorySlug) {
      return res.status(404).json({
        success: false,
        message: 'Article not found in this category'
      });
    }

    // Increment view count
    try {
      await strapiClient.put(`/doc-articles/${article.id}`, {
        data: {
          viewCount: (article.viewCount || 0) + 1
        }
      });
    } catch (updateError) {
      console.error('Error updating view count:', updateError.message);
      // Continue even if view count update fails
    }

    res.json({
      success: true,
      data: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        readingTime: article.readingTime,
        viewCount: article.viewCount,
        featured: article.featured,
        publishedAt: article.publishedAt,
        updatedAt: article.updatedAt,
        category: article.category ? {
          id: article.category.id,
          name: article.category.name,
          slug: article.category.slug
        } : null,
        featuredImage: article.featuredImage,
        ogImage: article.ogImage,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        seoKeywords: article.seoKeywords
      }
    });
  } catch (error) {
    console.error('Error fetching article:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch article'
    });
  }
};

// Get related articles (same category, random)
export const getRelatedArticles = async (req, res) => {
  try {
    const { categorySlug, articleSlug } = req.params;
    const { limit = 3 } = req.query;

    // First get the current article to get its category
    const articleResponse = await strapiClient.get('/doc-articles', {
      params: {
        'filters[slug][$eq]': articleSlug,
        'filters[publishedAt][$notNull]': true,
        'populate[category]': true
      }
    });

    const articleResults = articleResponse.data.results || articleResponse.data.data || [];

    if (!articleResults || articleResults.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }

    const currentArticle = articleResults[0];
    const categoryId = currentArticle.category?.id;

    if (!categoryId) {
      return res.json({
        success: true,
        data: []
      });
    }

    // Get other articles in same category
    const response = await strapiClient.get('/doc-articles', {
      params: {
        'filters[category][id][$eq]': categoryId,
        'filters[id][$ne]': currentArticle.id,
        'filters[publishedAt][$notNull]': true,
        'populate[category]': true,
        'populate[featuredImage]': true,
        'pagination[pageSize]': 20
      }
    });

    let relatedArticles = response.data.results || response.data.data || [];

    // Shuffle and limit
    relatedArticles = relatedArticles
      .sort(() => Math.random() - 0.5)
      .slice(0, parseInt(limit))
      .map(article => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        readingTime: article.readingTime,
        updatedAt: article.updatedAt,
        category: article.category ? {
          id: article.category.id,
          name: article.category.name,
          slug: article.category.slug
        } : null,
        featuredImage: article.featuredImage
      }));

    res.json({
      success: true,
      data: relatedArticles
    });
  } catch (error) {
    console.error('Error fetching related articles:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch related articles'
    });
  }
};

// Search articles
export const searchArticles = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json({
        success: true,
        data: []
      });
    }

    const response = await strapiClient.get('/doc-articles', {
      params: {
        'filters[$or][0][title][$containsi]': q,
        'filters[$or][1][content][$containsi]': q,
        'filters[publishedAt][$notNull]': true,
        'populate[category]': true,
        'populate[featuredImage]': true,
        'sort': 'updatedAt:desc'
      }
    });

    const results = response.data.results || response.data.data || [];

    const articles = results.map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      readingTime: article.readingTime,
      viewCount: article.viewCount,
      updatedAt: article.updatedAt,
      category: article.category ? {
        id: article.category.id,
        name: article.category.name,
        slug: article.category.slug
      } : null,
      featuredImage: article.featuredImage
    }));

    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error searching articles:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to search articles'
    });
  }
};

// Get featured articles
export const getFeaturedArticles = async (req, res) => {
  try {
    const response = await strapiClient.get('/doc-articles', {
      params: {
        'filters[featured][$eq]': true,
        'filters[publishedAt][$notNull]': true,
        'populate[category]': true,
        'populate[featuredImage]': true,
        'sort': 'viewCount:desc'
      }
    });

    const results = response.data.results || response.data.data || [];

    const articles = results.map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      readingTime: article.readingTime,
      viewCount: article.viewCount,
      featured: article.featured,
      updatedAt: article.updatedAt,
      category: article.category ? {
        id: article.category.id,
        name: article.category.name,
        slug: article.category.slug
      } : null,
      featuredImage: article.featuredImage
    }));

    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error fetching featured articles:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured articles'
    });
  }
};
