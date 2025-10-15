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
    // Seed doc categories
    try {
      const categories = [
        { name: 'Getting Started', slug: 'getting-started', description: 'Learn the basics of Coins For College', icon: 'Rocket', order: 1 },
        { name: 'Account & Security', slug: 'account-security', description: 'Manage your account and security settings', icon: 'Security', order: 2 },
        { name: 'Mining & Tokens', slug: 'mining-tokens', description: 'Everything about mining and earning tokens', icon: 'Build', order: 3 },
        { name: 'Referrals', slug: 'referrals', description: 'Learn about our referral program', icon: 'Group', order: 4 },
        { name: 'Colleges', slug: 'colleges', description: 'Information about colleges and partnerships', icon: 'School', order: 5 },
        { name: 'Privacy Policy', slug: 'privacy-policy', description: 'Our privacy policy and data handling', icon: 'Gavel', order: 6 },
        { name: 'Terms of Service', slug: 'terms-of-service', description: 'Terms and conditions of use', icon: 'Gavel', order: 7 },
        { name: 'Community Guidelines', slug: 'community-guidelines', description: 'Rules and guidelines for our community', icon: 'HelpOutline', order: 8 },
        { name: 'FAQ', slug: 'faq', description: 'Frequently asked questions', icon: 'QuestionAnswer', order: 9 },
        { name: 'Troubleshooting', slug: 'troubleshooting', description: 'Common issues and how to solve them', icon: 'Build', order: 10 }
      ];

      for (const category of categories) {
        const existing = await strapi.query('api::doc-category.doc-category').findOne({
          where: { slug: category.slug }
        });

        if (!existing) {
          await strapi.query('api::doc-category.doc-category').create({
            data: category
          });
          console.log(`Created doc category: ${category.name}`);
        }
      }
    } catch (error) {
      console.log('Note: Doc categories will be seeded after content types are created.');
    }

    // Set permissions for public access to blog and docs content
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
          'api::doc-category': ['find', 'findOne'],
          'api::doc-article': ['find', 'findOne'],
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
