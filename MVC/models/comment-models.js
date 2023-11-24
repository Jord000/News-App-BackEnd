const db = require('../../db/connection')

exports.selectCommentsByArticleId = (id, limit, p) => {
  let selectString = 'SELECT*FROM comments WHERE article_id = $1'
  let selectArray = [id]
  let defaultOrder = ` ORDER BY created_at ASC`
  let defaultLimit = ` LIMIT 10;`
  if (limit > 50) {
    return Promise.reject({
      status: 400,
      msg: 'Bad Request - limit too high max 50',
    })
  }
  if (limit) {
    selectArray.push(limit)
    selectString += defaultOrder += ` LIMIT $2;`
  } else if (p) {
    selectArray.push(p - 1)
    selectString += defaultOrder += ` LIMIT 10 OFFSET 10*$2;`
  } else {
    selectString += defaultOrder += defaultLimit
  }
  return db.query(selectString, selectArray).then(({ rows: comments }) => {
    if (comments.length === 0 && p > 1) {
      return Promise.reject({ status: 400, msg: 'Bad Request' })
    } else return comments
  })
}

exports.addCommentToArticleById = (id, { body, username }) => {
  return db
    .query(
      'INSERT INTO comments ( article_id, author, body) VALUES ($1,$2,$3) RETURNING*;',
      [id, username, body]
    )
    .then(({ rows }) => {
      return rows
    })
}

exports.deleteOneComment = (id) => {
  return db.query('DELETE FROM comments WHERE comment_id = $1;', [id])
}

exports.selectAllComments = () => {
  return db.query('SELECT*FROM comments;').then(({ rows: comments }) => {
    return comments
  })
}

exports.selectCommentById = (id) => {
  return db
    .query('SELECT*FROM comments WHERE comment_id = $1;', [id])
    .then(({ rows: [comments] }) => {
      if (!comments) {
        return Promise.reject({ status: 404, msg: 'Not Found' })
      } else return comments
    })
}

exports.incCommentVotesById = (id, inc) => {
  return db
    .query(
      'UPDATE comments SET votes = votes + $2 WHERE comment_id = $1 RETURNING*;',
      [id, inc]
    )
    .then(({ rows: comment }) => {
      return comment
    })
}
