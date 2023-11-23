const commentsRouter = require('express').Router()
const { deleteCommentById, getAllComments, incrementCommentVotes,getCommentById } = require('../MVC/controllers')

commentsRouter.get('/', getAllComments)
commentsRouter.route('/:comment_id').get(getCommentById).patch(incrementCommentVotes).delete(deleteCommentById)

module.exports = commentsRouter
