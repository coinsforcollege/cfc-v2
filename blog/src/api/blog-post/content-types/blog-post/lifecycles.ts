export default {
  async beforeCreate(event) {
    const start = Date.now();
    event.state = event.state || {};
    event.state.startTime = start;
    console.log(`[LIFECYCLE] beforeCreate - timestamp: ${start}`);
  },

  async afterCreate(event) {
    const duration = Date.now() - (event.state?.startTime || Date.now());
    console.log(`[LIFECYCLE] afterCreate - duration: ${duration}ms`);
  },

  async beforeUpdate(event) {
    const start = Date.now();
    event.state = event.state || {};
    event.state.startTime = start;
    console.log(`[LIFECYCLE] beforeUpdate - timestamp: ${start}`);
  },

  async afterUpdate(event) {
    const duration = Date.now() - (event.state?.startTime || Date.now());
    console.log(`[LIFECYCLE] afterUpdate - duration: ${duration}ms`);
  },
};

