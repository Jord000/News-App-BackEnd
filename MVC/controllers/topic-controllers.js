const { selectAllTopics, postTopic } = require('../models/topic-models')

exports.getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics })
    })
    .catch(next)
}

exports.postNewTopic = (req, res, next) => {
  const topicToPost = req.body
  postTopic(topicToPost)
    .then((topic) => {
      res.status(201).send({ topic })
    })
    .catch(next)
}
