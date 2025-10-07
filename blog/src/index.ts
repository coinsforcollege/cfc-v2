export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Set permissions for public access to blog content
    // Note: Run this after first starting Strapi and creating content types
    try {
      const publicRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: 'public' } });

      if (publicRole) {
        const permissions = {
          'api::blog-post': ['find', 'findOne'],
          'api::author': ['find', 'findOne'],
          'api::category': ['find', 'findOne'],
          'api::tag': ['find', 'findOne'],
          'api::comment': ['find', 'create'],
          'api::subscriber': ['create'],
          'api::contact-submission': ['create'],
        };

        for (const [controller, actions] of Object.entries(permissions)) {
          for (const action of actions) {
            const existingPermissions = await strapi.query('plugin::users-permissions.permission').findMany({
              where: {
                role: publicRole.id,
                action: `${controller}.${action}`,
              },
            });

            // Only update if permissions exist
            if (existingPermissions && existingPermissions.length > 0) {
              await strapi.query('plugin::users-permissions.permission').updateMany({
                where: {
                  role: publicRole.id,
                  action: `${controller}.${action}`,
                },
                data: { enabled: true },
              });
            }
          }
        }
      }
    } catch (error) {
      console.log('Note: Permissions will be set after content types are created. You can set them manually in Settings > Users & Permissions > Public role.');
    }
  },
};
