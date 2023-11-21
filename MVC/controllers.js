const {
  selectAllTopics,
  selectEndPoints,
  selectAllArticles,
  selectArticleById,
  selectCommentsById,
  incVotesById,
} = require('./models');

exports.healthCheck = (req, res) => {
  res.status(200).send('API is online and running');
};

exports.getAllTopics = (req, res, next) => {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getEndPoints = (req, res, next) => {
  selectEndPoints()
    .then((data) => res.status(200).send({ data }))
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  selectArticleById(articleId)
    .then((article) => {
      res.status(200).send({ ['article' + articleId]: article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  selectAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  const promisesInput = [
    selectArticleById(articleId),
    selectCommentsById(articleId),
  ];

  Promise.all(promisesInput)
    .then((results) => {
      res.status(200).send({ comments: results[1] });
    })
    .catch(next);
};

exports.incrementVotes = (req, res, next) => {
  const articleId = req.params.article_id;
  const incAmount = req.body.inc_votes;
  incVotesById(articleId, incAmount)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.incorrectPath = (req, res) => {
  res.status(404).send({ msg: 'incorrect path - path not found' });
};
