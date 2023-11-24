const { selectEndPoints } = require('../models/general-models')


exports.healthCheck = (req, res) => {
  res.status(200).send('API is online and running')
}

exports.getEndPoints = (req, res, next) => {
  selectEndPoints()
    .then((data) => res.status(200).send({ data }))
    .catch(next)
}


exports.incorrectPath = (req, res) => {
  res.status(404).send({ msg: 'incorrect path - path not found' })
}
