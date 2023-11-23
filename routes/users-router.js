const usersRouter = require('express').Router()
const { getAllUsers,getUserByUsername } = require('../MVC/controllers')

usersRouter.get('/', getAllUsers)
usersRouter.get('/:username',getUserByUsername)

module.exports = usersRouter
