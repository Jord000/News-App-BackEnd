const db = require('../../db/connection')

exports.selectAllUsers = () => {
  return db.query('SELECT*FROM users;').then(({ rows: users }) => {
    return users
  })
}

exports.selectUsername = (username) => {
  return db
    .query('SELECT*FROM users WHERE username = $1;', [username])
    .then(({ rows: [username] }) => {
      if (!username) {
        return Promise.reject({ status: 404, msg: 'Not Found' })
      } else return username
    })
}



