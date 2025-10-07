export default [
  'global::timer',
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['http://localhost:3000', 'http://localhost:5173', 'https://coinsforcollege.org',
        'https://www.coinsforcollege.org',
        'https://cfc-v2.onrender.com',process.env.CLIENT_URL].filter(Boolean),
      headers: '*',
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
