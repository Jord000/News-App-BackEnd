const { selectAllTopics } = require('./models')

exports.healthCheck = (req, res) => {
  res.status(200).send('API is online and running')
}

exports.getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({topics})
    })
    .catch(next)
}

exports.incorrectPath = (req, res,next) => {
    res.status(404).send({ msg: 'incorrect path - path not found' })
  }