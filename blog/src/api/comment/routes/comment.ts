export default {
  routes: [
    {
      method: 'GET',
      path: '/comments',
      handler: 'comment.find',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/comments',
      handler: 'comment.create',
      config: { auth: false },
    },
  ],
};

