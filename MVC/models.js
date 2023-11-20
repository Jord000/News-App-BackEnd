const db = require('../db/connection')
const fsPromise = require('fs/promises')

exports.selectAllTopics = () => {
  return db.query('SELECT*FROM topics;').then(({rows: topics}) => {
    return topics
  })
}

exports.selectEndPoints = () =>{
  return fsPromise.readFile(`${__dirname}/../endpoints.json`).then((data)=>{
    return JSON.parse(data)
  })
}