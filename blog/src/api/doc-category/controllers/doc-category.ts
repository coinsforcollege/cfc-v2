import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::doc-category.doc-category', ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;

    const entity = await strapi.service('api::doc-category.doc-category').find({
      ...query,
      populate: {
        doc_articles: {
          populate: {
            category: true,
            featuredImage: true,
          },
        },
      },
    });

    return entity;
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.service('api::doc-category.doc-category').findOne(id, {
      populate: {
        doc_articles: {
          populate: {
            category: true,
            featuredImage: true,
          },
        },
      },
    });

    return entity;
  },
}));
