export default {
  routes: [
    {
      method: 'GET',
      path: '/doc-categories',
      handler: 'doc-category.find',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/doc-categories/:id',
      handler: 'doc-category.findOne',
      config: {
        auth: false,
      },
    },
  ],
};
