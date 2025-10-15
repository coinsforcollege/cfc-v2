export default {
  routes: [
    {
      method: 'GET',
      path: '/doc-articles',
      handler: 'doc-article.find',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/doc-articles/:id',
      handler: 'doc-article.findOne',
      config: {
        auth: false,
      },
    },
  ],
};
