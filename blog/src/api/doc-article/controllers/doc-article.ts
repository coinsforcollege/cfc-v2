import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::doc-article.doc-article', ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;

    const filters = {
      publishedAt: { $notNull: true },
      ...(query.filters as Record<string, any> || {}),
    };

    const entity = await strapi.service('api::doc-article.doc-article').find({
      ...query,
      filters,
      populate: {
        featuredImage: true,
        category: true,
        ogImage: true,
      },
    });

    return entity;
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.service('api::doc-article.doc-article').findOne(id, {
      filters: {
        publishedAt: { $notNull: true },
      },
      populate: {
        featuredImage: true,
        category: true,
        ogImage: true,
      },
    });

    return entity;
  },
}));
