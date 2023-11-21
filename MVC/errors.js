exports.sqlError = (err, req, res, next) => {
  if (err.code === '22003') {
    res.status(400).send({ msg: 'Bad Request - outside range' });
  } else if (err.code === '23503') {
    res.status(404).send({ msg: 'Not Found' });
  } else if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad Request' });
  } else if (err.code === '23502') {
    res.status(400).send({ msg: 'Bad Request' });
  } else next(err);
};

exports.customError = (err, req, res, next) => {

  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.internalError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send('internal server error');
};
