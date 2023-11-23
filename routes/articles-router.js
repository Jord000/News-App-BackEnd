const articlesRouter = require('express').Router()
const {
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentToArticle,
  incrementVotes,
} = require('../MVC/controllers.js')

articlesRouter.get('/', getAllArticles)
articlesRouter.route('/:article_id').get(getArticleById).patch(incrementVotes)

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentToArticle)

module.exports = articlesRouter
