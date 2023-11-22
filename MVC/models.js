const db = require('../db/connection');
const fsPromise = require('fs/promises');
const {articleCategoryCheck} = require('./mvc-utils')

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

exports.selectAllArticles = (query) => {
  const queryKey = Object.keys(query)[0]
  let selectArray = undefined
  let selectString = `SELECT 
  articles.article_id,
  articles.title,
  articles.topic,
  articles.author,
  articles.created_at,
  articles.votes,
  article_img_url,COUNT(comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id=comments.article_id`

  const defaultEndString = `
  GROUP BY articles.article_id
  ORDER BY created_at DESC;`

  if(queryKey){
    articleCategoryCheck(queryKey)
    selectArray = [`${query[queryKey]}`]
    selectString = `${selectString} WHERE articles.${queryKey} = $1 ${defaultEndString}`
}
  else{selectString+=defaultEndString}
  return db.query(selectString,selectArray).then(({ rows: articles }) => {
    return articles;
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

exports.selectCommentsById = (id) => {
  return db
    .query(
      'SELECT*FROM comments WHERE article_id = $1  ORDER BY created_at ASC;',
      [id]
    )
    .then(({ rows: comments }) => {
      return comments;
    });
};

exports.addCommentToArticleById = (id, { body, username }) => {
  return db
    .query(
      'INSERT INTO comments ( article_id, author, body) VALUES ($1,$2,$3) RETURNING*;',
      [id, username, body]
    )
    .then(({ rows }) => {
      return rows;
    });
};
