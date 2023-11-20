const express = require('express')
const {
  healthCheck,
  getAllTopics,
  incorrectPath,
  getEndPoints,
  getArticleById
} = require('./controllers')
const { customError, internalError } = require('./errors')

const app = express()

app.get('/api/healthcheck', healthCheck)
app.get('/api/topics', getAllTopics)
app.get('/api', getEndPoints)
app.get('/api/articles/:article_id',getArticleById)

app.all('/*', incorrectPath)

app.use(customError)
app.use(internalError)

module.exports = app


