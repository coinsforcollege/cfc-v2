import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::blog-post.blog-post', ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;
    
    const filters = {
      publishedAt: { $notNull: true },
      ...(query.filters as Record<string, any> || {}),
    };
    
    const entity = await strapi.service('api::blog-post.blog-post').find({
      ...query,
      filters,
      populate: {
        featuredImage: true,
        author: {
          populate: ['avatar'],
        },
        categories: true,
        tags: true,
        content: {
          on: {
            'content.image': {
              populate: ['image'],
            },
            'content.image-slider': {
              populate: ['images'],
            },
            'content.text-block': true,
            'content.video': true,
            'content.cta-banner': true,
            'content.quote': true,
          },
        },
      },
    });
    
    return entity;
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    
    const entity = await strapi.service('api::blog-post.blog-post').findOne(id, {
      filters: {
        publishedAt: { $notNull: true },
      },
      populate: {
        featuredImage: true,
        author: {
          populate: ['avatar'],
        },
        categories: true,
        tags: true,
        seo: {
          populate: ['ogImage'],
        },
        content: {
          on: {
            'content.image': {
              populate: ['image'],
            },
            'content.image-slider': {
              populate: ['images'],
            },
            'content.text-block': true,
            'content.video': true,
            'content.cta-banner': true,
            'content.quote': true,
          },
        },
      },
    });
    
    return entity;
  },

  async publish(ctx) {
    const start = Date.now();
    console.log('[PUBLISH ACTION] Starting publish...');
    
    try {
      const result = await strapi
        .service('api::blog-post.blog-post')
        .publish(ctx.params.id);
      
      console.log(`[PUBLISH ACTION] Completed in ${Date.now() - start}ms`);
      return result;
    } catch (error) {
      console.log(`[PUBLISH ACTION] Failed after ${Date.now() - start}ms`);
      throw error;
    }
  },
}));
