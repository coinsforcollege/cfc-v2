import { factories } from '@strapi/strapi';
import crypto from 'crypto';

export default factories.createCoreController('api::subscriber.subscriber', ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;
    
    // Check if already subscribed
    const existing = await strapi.db.query('api::subscriber.subscriber').findOne({
      where: { email: data.email },
    });
    
    if (existing) {
      if (existing.active) {
        return ctx.badRequest('Already subscribed');
      } else {
        // Reactivate
        await strapi.service('api::subscriber.subscriber').update(existing.id, {
          data: { active: true },
        });
        return { message: 'Subscription reactivated' };
      }
    }
    
    // Generate unsubscribe token
    const unsubscribeToken = crypto.randomBytes(32).toString('hex');
    
    const entity = await strapi.service('api::subscriber.subscriber').create({
      data: {
        ...data,
        unsubscribeToken,
      },
    });
    
    return entity;
  },

  async unsubscribe(ctx) {
    const { token } = ctx.request.body.data || {};
    
    const subscriber = await strapi.db.query('api::subscriber.subscriber').findOne({
      where: { unsubscribeToken: token },
    });
    
    if (!subscriber) {
      return ctx.badRequest('Invalid token');
    }
    
    await strapi.service('api::subscriber.subscriber').update(subscriber.id, {
      data: { active: false },
    });
    
    return { message: 'Unsubscribed successfully' };
  },
}));

