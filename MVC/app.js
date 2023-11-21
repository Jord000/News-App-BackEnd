const express = require('express')
const {
  healthCheck,
  getAllTopics,
  incorrectPath,
  getEndPoints,
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentToArticle,
  deleteCommentById,
  getAllComments,
} = require('./controllers')
const { customError, internalError,sqlError } = require('./errors')

const app = express()
app.use(express.json());

app.get('/api/healthcheck', healthCheck)
app.get('/api/topics', getAllTopics)
app.get('/api', getEndPoints)
app.get('/api/articles/:article_id',getArticleById)
app.get('/api/articles',getAllArticles)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.get('/api/comments',getAllComments)

app.post('/api/articles/:article_id/comments',postCommentToArticle)
app.delete('/api/comments/:comment_id',deleteCommentById)

app.all('/*', incorrectPath)

app.use(sqlError)
app.use(customError)
app.use(internalError)

module.exports = app


