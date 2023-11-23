const {
  selectAllTopics,
  selectEndPoints,
  selectAllArticles,
  selectArticleById,
  selectCommentsByArticleId,
  addCommentToArticleById,
  deleteOneComment,
  selectAllComments,
  selectCommentById,
  selectAllUsers,
  incArticleVotesById,
  incCommentVotesById,
  selectTopicBySlug,
  selectUsername,
} = require('./models')

exports.healthCheck = (req, res) => {
  res.status(200).send('API is online and running')
}

exports.getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics })
    })
    .catch(next)
}

exports.getEndPoints = (req, res, next) => {
  selectEndPoints()
    .then((data) => res.status(200).send({ data }))
    .catch(next)
}

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id
  selectArticleById(articleId)
    .then((article) => {
      res.status(200).send({ ['article' + articleId]: article })
    })
    .catch(next)
}

exports.getAllArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query
  const promiseInput = [selectAllArticles(topic, sort_by, order)]
  if (Object.keys(req.query).length && !topic && !sort_by && !order) {
    promiseInput.push(Promise.reject({ status: 400, msg: 'Bad Request' }))
  }

  if (topic) {
    promiseInput.push(selectTopicBySlug(topic))
  }
  Promise.all(promiseInput)
    .then(([articles]) => {
      res.status(200).send({ articles })
    })
    .catch(next)
}

exports.getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id
  const promisesInput = [
    selectArticleById(articleId),
    selectCommentsByArticleId(articleId),
  ]

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
  addCommentToArticleById(articleId, post)
    .then(([comment]) => {
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

exports.incrementArticleVotes = (req, res, next) => {
  const articleId = req.params.article_id
  const incAmount = req.body.inc_votes
  const promisesInput = [
    selectArticleById(articleId),
    incArticleVotesById(articleId, incAmount),
  ]

  Promise.all(promisesInput)
    .then(([result0, articleOutput]) => {
      res.status(200).send({ article: articleOutput })
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

exports.getAllUsers = (req, res, next) => {
  selectAllUsers()
    .then((users) => {
      res.status(200).send({ users })
    })
    .catch(next)
}

exports.getUserByUsername = (req, res, next) => {
  const username = req.params.username
  selectUsername(username)
    .then((user) => {
      res.status(200).send({ user })
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

exports.incorrectPath = (req, res) => {
  res.status(404).send({ msg: 'incorrect path - path not found' })
}
