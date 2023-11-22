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

exports.selectAllArticles = () => {
  return db
    .query(
      `SELECT 
  articles.article_id,
  articles.title,
  articles.topic,
  articles.author,
  articles.created_at,
  articles.votes,
  article_img_url,COUNT(comment_id) AS comment_count
  FROM articles 
  LEFT JOIN comments ON articles.article_id=comments.article_id 
  GROUP BY articles.article_id
  ORDER BY created_at DESC;`
    )
    .then(({ rows: articles }) => {
      return articles;
    });
};

exports.selectArticleById = (id) => {
  return db
    .query(
      `SELECT 
    articles.*,
    COUNT(comment_id) AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id=comments.article_id 
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
      [id]
    )
    .then(({ rows: [article] }) => {
      article.comment_count = Number(article.comment_count)
      if (!article) {
        return Promise.reject({ status: 404, msg: 'Not Found' });
      }
      return article;
    });
};

exports.selectCommentsByArticleId = (id) => {
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

exports.deleteOneComment = (id) => {
  return db.query('DELETE FROM comments WHERE comment_id = $1;', [id]);
};

exports.selectAllComments = () => {
  return db.query('SELECT*FROM comments;').then(({ rows: comments }) => {
    return comments;
  });
};

exports.selectCommentById = (id) => {
  return db
    .query('SELECT*FROM comments WHERE comment_id = $1;', [id])
    .then(({ rows: [comments] }) => {
      if (!comments) {
        return Promise.reject({ status: 404, msg: 'Not Found' });
      } else return comments;
    });
};

exports.selectAllUsers = () => {
  return db.query('SELECT*FROM users;').then(({ rows: users }) => {
    return users;
  });
};
exports.incVotesById = (id, inc) => {
  return db
    .query(
      'UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING*;',
      [id, inc]
    )
    .then(({ rows: article }) => {
      return article;
    });
};
