const db = require('../db/connection')

exports.selectAllTopics = () => {
  return db.query('SELECT*FROM topics;').then(({rows: topics}) => {
    return topics
  })
}
