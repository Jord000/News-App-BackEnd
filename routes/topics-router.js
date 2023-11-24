const topicsRouter = require('express').Router()
const{ getAllTopics, postNewTopic} = require('../MVC/controllers')


topicsRouter.route('/').get(getAllTopics).post(postNewTopic)

module.exports = topicsRouter