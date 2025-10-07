import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::comment.comment', ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;
    
    const filters = {
      approved: true,
      parentComment: null, // Only root comments
      ...(query.filters as Record<string, any> || {}),
    };
    
    const entity = await strapi.service('api::comment.comment').find({
      ...query,
      filters,
      populate: {
        replies: {
          populate: ['replies'],
        },
      },
    });
    
    return entity;
  },

  async create(ctx) {
    const { data } = ctx.request.body;
    
    // Set IP address
    const ipAddress = ctx.request.ip;
    
    const entity = await strapi.service('api::comment.comment').create({
      data: {
        ...data,
        ipAddress,
        approved: false, // Requires approval
      },
    });
    
    return entity;
  },
}));

