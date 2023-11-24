const {
  selectCommentsByArticleId,
  addCommentToArticleById,
  deleteOneComment,
  selectAllComments,
  selectCommentById,
  incCommentVotesById,
} = require('../models/comment-models')
const { selectArticleById } = require('../models/article-models')

exports.getCommentsByArticleId = (req, res, next) => {
  const { limit, p } = req.query
  const articleId = req.params.article_id
  const promisesInput = [
    selectArticleById(articleId),
    selectCommentsByArticleId(articleId, limit, p),
  ]
  if (Object.keys(req.query).length && !limit && !p) {
    promisesInput.push(Promise.reject({ status: 400, msg: 'Bad Request' }))
  }

  Promise.all(promisesInput)
    .then((results) => {
      res.status(200).send({ comments: results[1] })
    })
    .catch(next)
}

exports.getCommentById = (req, res, next) => {
  const commentId = req.params.comment_id
  selectCommentById(commentId)
    .then((comment) => {
      res.status(200).send({ comment })
    })
    .catch(next)
}

exports.postCommentToArticle = (req, res, next) => {
  const articleId = req.params.article_id
  const post = req.body
  Promise.all([
    selectArticleById(articleId),
    addCommentToArticleById(articleId, post),
  ])
    .then(([result, [comment]]) => {
      res.status(201).send({ comment })
    })
    .catch(next)
}
exports.deleteCommentById = (req, res, next) => {
  const commentId = req.params.comment_id
  const promiseInput = [
    selectCommentById(commentId),
    deleteOneComment(commentId),
  ]
  Promise.all(promiseInput)
    .then((promiseResults) => {
      res.status(204).send()
    })
    .catch(next)
}

exports.incrementCommentVotes = (req, res, next) => {
  const commentId = req.params.comment_id
  const incAmount = req.body.inc_votes
  const promiseInput = [
    selectCommentById(commentId),
    incCommentVotesById(commentId, incAmount),
  ]
  Promise.all(promiseInput)
    .then(([result0, commentOutput]) => {
      res.status(200).send({ comment: commentOutput })
    })
    .catch(next)
}

exports.getAllComments = (req, res, next) => {
  selectAllComments()
    .then((comments) => {
      res.status(200).send({ comments })
    })
    .catch(next)
}
