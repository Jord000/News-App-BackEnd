const {
  selectAllTopics,
  selectEndPoints,
  selectAllArticles,
  selectArticleById,
  selectCommentsByArticleId,
  addCommentToArticleById,
  deleteOneComment,
  selectAllComments,
  selectCommentById,
  selectAllUsers,
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
  const query = req.query
  selectAllArticles(query)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  const promisesInput = [
    selectArticleById(articleId),
    selectCommentsByArticleId(articleId),
  ];

  Promise.all(promisesInput)
    .then((results) => {
      res.status(200).send({ comments: results[1] });
    })
    .catch(next);
};

exports.postCommentToArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  const post = req.body;
  addCommentToArticleById(articleId, post)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const commentId = req.params.comment_id;
  const promiseInput = [
    selectCommentById(commentId),
    deleteOneComment(commentId),
  ];
  Promise.all(promiseInput)
    .then((promiseResults) => {
      res.status(204).send();
    })
    .catch(next);
};

exports.incrementVotes = (req, res, next) => {
  const articleId = req.params.article_id;
  const incAmount = req.body.inc_votes;
  const promisesInput = [
    selectArticleById(articleId),
    incVotesById(articleId, incAmount),
  ];

  Promise.all(promisesInput)
    .then(([result0, result1]) => {
      res.status(200).send({ article: result1 });
    })
    .catch(next);
};

exports.postCommentToArticle = (req, res, next) => {
  const articleId = req.params.article_id;
  const post = req.body;
  addCommentToArticleById(articleId, post)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getAllUsers = (req, res, next) => {
  selectAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getAllComments = (req, res, next) => {
  selectAllComments().then((comments) => {
    res.status(200).send({ comments });
  });
};

exports.incorrectPath = (req, res) => {
  res.status(404).send({ msg: 'incorrect path - path not found' });
};
