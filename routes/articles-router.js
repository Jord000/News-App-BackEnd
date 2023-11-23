const articlesRouter = require('express').Router()
const {
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentToArticle,
  incrementArticleVotes,
  postAnArticle,
} = require('../MVC/controllers.js')

articlesRouter.route('/').get(getAllArticles).post(postAnArticle)
articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(incrementArticleVotes)

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentToArticle)

module.exports = articlesRouter
