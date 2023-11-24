const db = require('../../db/connection')

exports.selectAllTopics = () => {
  return db.query('SELECT*FROM topics;').then(({ rows: topics }) => {
    return topics
  })
}

exports.selectTopicBySlug = (topic) => {
  return db
    .query('SELECT*FROM topics WHERE slug = $1;', [topic])
    .then(({ rows: [topics] }) => {
      if (!topics) {
        return Promise.reject({ status: 404, msg: 'Not Found' })
      } else return topics
    })
}

exports.postTopic = (topicToPost) => {
  const { slug, description } = topicToPost
  if (!slug || !description) {
    return Promise.reject({ status: 400, msg: 'Bad Request' })
  }

  return db
    .query(
      'INSERT INTO topics (slug, description) VALUES ($1,$2) RETURNING *;',
      [slug, description]
    )
    .then(({ rows: [topic] }) => {
      return topic
    })
}
