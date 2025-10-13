export default {
  routes: [
    {
      method: 'GET',
      path: '/announcements',
      handler: 'announcement.find',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/announcements/:id',
      handler: 'announcement.findOne',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/announcements',
      handler: 'announcement.create',
      config: { auth: false },
    },
    {
      method: 'PUT',
      path: '/announcements/:id',
      handler: 'announcement.update',
      config: { auth: false },
    },
    {
      method: 'DELETE',
      path: '/announcements/:id',
      handler: 'announcement.delete',
      config: { auth: false },
    },
  ],
};
