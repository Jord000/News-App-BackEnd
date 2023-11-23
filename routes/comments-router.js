const commentsRouter = require('express').Router()
const { deleteCommentById, getAllComments } = require('../MVC/controllers')

commentsRouter.get('/', getAllComments)
commentsRouter.delete('/:comment_id', deleteCommentById)


module.exports = commentsRouter
