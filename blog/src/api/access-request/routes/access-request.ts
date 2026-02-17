export default {
  routes: [
    {
      method: 'POST',
      path: '/access-requests',
      handler: 'access-request.create',
      config: { auth: false },
    },
  ],
};
