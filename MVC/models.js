const db = require('../db/connection');
const fsPromise = require('fs/promises');

exports.selectAllTopics = () => {
  return db.query('SELECT*FROM topics;').then(({ rows: topics }) => {
    return topics;
  });
};

exports.selectEndPoints = () => {
  return fsPromise.readFile(`${__dirname}/../endpoints.json`).then((data) => {
    return JSON.parse(data);
  });
};

exports.selectArticleById = (id) => {
  return db
    .query('SELECT*FROM articles WHERE article_id = $1;', [id])
    .then(({ rows: [article] }) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: 'Not Found' });
      }
      return article;
    });
};
