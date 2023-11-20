const db = require('../db/connection')
const fsPromise = require('fs/promises')

exports.selectAllTopics = () => {
  return db.query('SELECT*FROM topics;').then(({ rows: topics }) => {
    return topics
  })
}

exports.selectEndPoints = () => {
  return fsPromise.readFile(`${__dirname}/../endpoints.json`).then((data) => {
    return JSON.parse(data)
  })
}

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
      return articles
    })
}
