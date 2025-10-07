import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::contact-submission.contact-submission', ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;
    
    // Set IP address
    const ipAddress = ctx.request.ip;
    
    const entity = await strapi.service('api::contact-submission.contact-submission').create({
      data: {
        ...data,
        ipAddress,
      },
    });
    
    return entity;
  },
}));

