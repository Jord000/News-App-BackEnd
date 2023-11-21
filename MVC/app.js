const express = require('express');
const {
  healthCheck,
  getAllTopics,
  incorrectPath,
  getEndPoints,
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentToArticle,
  incrementVotes,
} = require('./controllers')
const { customError, internalError,sqlError } = require('./errors')

const app = express();
app.use(express.json());

app.get('/api/healthcheck', healthCheck);
app.get('/api/topics', getAllTopics);
app.get('/api', getEndPoints);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles', getAllArticles);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.patch('/api/articles/:article_id', incrementVotes);
app.post('/api/articles/:article_id/comments',postCommentToArticle)


app.all('*', incorrectPath);

app.use(sqlError);
app.use(customError);
app.use(internalError);

module.exports = app;
