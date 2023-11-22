const db = require('../db/connection');
exports.articleCategoryCheck = (category) => {
  const permittedCategories = ['author', 'topic', 'title'];
  if (!permittedCategories.includes(category))
    return Promise.reject({ status: 404, msg: 'Not Found' });
  else return undefined;
};
