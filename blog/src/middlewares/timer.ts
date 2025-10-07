export default (config, { strapi }) => {
  return async (ctx, next) => {
    const start = Date.now();
    console.log(`[REQUEST START] ${ctx.method} ${ctx.url}`);
    
    await next();
    
    const delta = Date.now() - start;
    console.log(`[REQUEST END] ${ctx.method} ${ctx.url} - ${delta}ms`);
  };
};

