export default {
  routes: [
    {
      method: 'GET',
      path: '/blog-posts',
      handler: 'blog-post.find',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/blog-posts/:id',
      handler: 'blog-post.findOne',
      config: {
        auth: false,
      },
    },
  ],
};

