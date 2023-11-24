const articlesRouter = require('express').Router()
const {
  getAllArticles,
  getArticleById,
  incrementArticleVotes,
  postAnArticle,
  deleteArticleById,
} = require('../MVC/controllers/article-controllers.js')

const {
  getCommentsByArticleId,
  postCommentToArticle,
} = require('../MVC/controllers/comment-controllers.js')

articlesRouter.route('/').get(getAllArticles).post(postAnArticle)
articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(incrementArticleVotes)
  .delete(deleteArticleById)

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentToArticle)

module.exports = articlesRouter
