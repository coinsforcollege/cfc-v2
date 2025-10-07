export default {
  routes: [
    {
      method: 'GET',
      path: '/authors',
      handler: 'author.find',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/authors/:id',
      handler: 'author.findOne',
      config: { auth: false },
    },
  ],
};

