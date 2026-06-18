/**
 * book middleware for populating relationships
 */

export default (config: any, { strapi }: any) => {
  return async (ctx: any, next: any) => {
    ctx.query = ctx.query || {};

    const populate = {
      cover: true,
      genres: {
        fields: ["id", "name", "slug"],
      },
      chapters: {
        fields: ["id", "title", "slug", "publishedAt"],
        sort: ["publishedAt:desc"],
        limit: 10,
      },
      seo: {
        populate: {
          metaImage: true,
        },
      },
    };

    ctx.query.populate = populate;

    await next();
  };
};
