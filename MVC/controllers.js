const { selectAllTopics } = require('./models')

exports.healthCheck = (req, res) => {
  res.status(200).send('API is online and running')
}

exports.getAllTopics = (req, res, next) => {
  selectAllTopics().then((topics) => {
    res.status(200).send(topics)
  })
}
