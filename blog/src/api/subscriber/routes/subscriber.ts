export default {
  routes: [
    {
      method: 'POST',
      path: '/subscribers',
      handler: 'subscriber.create',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/subscribers/unsubscribe',
      handler: 'subscriber.unsubscribe',
      config: { auth: false },
    },
  ],
};

