export default {
  routes: [
    {
      method: 'POST',
      path: '/contact-submissions',
      handler: 'contact-submission.create',
      config: { auth: false },
    },
  ],
};

