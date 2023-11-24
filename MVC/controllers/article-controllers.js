const {
    postArticletoArticles,
    selectAllArticles,
    selectArticleById,
    incArticleVotesById,
    totalArticleCount,
    deleteOneArticle,
  } = require('../models/article-models')
  const{selectTopicBySlug} = require('../models/topic-models')


exports.getArticleById = (req, res, next) => {
    const articleId = req.params.article_id
    selectArticleById(articleId) 
      .then((article) => {
        res.status(200).send({ ['article' + articleId]: article })
      })
      .catch(next)
  }
  
  exports.getAllArticles = (req, res, next) => {
    const { topic, sort_by, order, limit, p } = req.query
    const promiseInput = [
      selectAllArticles(topic, sort_by, order, limit, p),
      totalArticleCount(p,topic),
    ]
    if (
      Object.keys(req.query).length &&
      !topic &&
      !sort_by &&
      !order &&
      !limit &&
      !p
    ) {
      promiseInput.push(Promise.reject({ status: 400, msg: 'Bad Request' }))
    }
  
    if (topic) {
      promiseInput.push(selectTopicBySlug(topic))
    }
    Promise.all(promiseInput)
      .then(([articles, { total_count }]) => {
        res.status(200).send({ articles, total_count })
      })
      .catch(next)
  }

  exports.incrementArticleVotes = (req, res, next) => {
    const articleId = req.params.article_id
    const incAmount = req.body.inc_votes
    const promisesInput = [
      selectArticleById(articleId),
      incArticleVotesById(articleId, incAmount),
    ]
  
    Promise.all(promisesInput)
      .then(([result0, articleOutput]) => {
        res.status(200).send({ article: articleOutput })
      })
      .catch(next)
  }
  
  exports.postAnArticle = (req, res, next) => {
    const articlePost = req.body
    postArticletoArticles(articlePost)
      .then((article_id) => {
        selectArticleById(article_id).then((article) => {
          res.status(201).send({ article })
        })
      })
      .catch(next)
  }


exports.deleteArticleById = (req, res, next) => {
    const articleId = req.params.article_id
    const promiseInput = [
      selectArticleById(articleId),
      deleteOneArticle(articleId),
    ]
    Promise.all(promiseInput)
      .then((promiseResults) => {
        res.status(204).send()
      })
      .catch(next)
  }