export default [
  'global::timer',
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['http://localhost:3000', 'http://localhost:3000', 'https://coinsforcollege.org','http://192.168.0.195:3000','http://192.168.0.195:4000',
        'https://www.coinsforcollege.org','http://192.168.0.16:3000', 'http://192.168.0.16:4000',
        'https://cfc-v2.onrender.com','https://collegenz-marketing.onrender.com','https://collegenz.com','https://www.collegenz.com',process.env.CLIENT_URL].filter(Boolean),
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
