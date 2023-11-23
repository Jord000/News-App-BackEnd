const topicsRouter = require('express').Router()
const{ getAllTopics} = require('../MVC/controllers')


topicsRouter.get('/', getAllTopics)

module.exports = topicsRouter