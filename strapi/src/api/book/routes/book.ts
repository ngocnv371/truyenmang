/**
 * book router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::book.book', {
  config: {
    find: {
      // middlewares: ["api::book.book-populate"],
    },
    findOne: {
      // middlewares: ["api::book.book-populate"],
    },
  },
});