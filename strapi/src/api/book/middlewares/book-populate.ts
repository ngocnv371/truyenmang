/**
 * book middleware for populating relationships
 */

export default (config: any, { strapi }: any) => {
  return async (ctx: any, next: any) => {
    ctx.query = ctx.query || {};

    const populate = {
      // TODO: populate only the thumbnail of the cover image
      cover: true,
      genres: {
        fields: ['id', 'name', 'slug'],
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
