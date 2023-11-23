const usersRouter = require('express').Router()
const { getAllUsers } = require('../MVC/controllers')

usersRouter.get('/', getAllUsers)

module.exports = usersRouter
