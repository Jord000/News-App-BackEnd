
exports.customError = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg })
  } else next(err)
}

exports.internalError = (err, req, res, next) => {
  console.log(err)
  res.status(500).send('internal server error')
}
