const app = require('../MVC/app.js')
const seed = require('../db/seeds/seed.js')
const request = require('supertest')
const db = require('../db/connection.js')
const {
  userData,
  topicData,
  commentData,
  articleData,
} = require('../db/data/test-data/index.js')
const endpointFile = require('../endpoints.json')
const jestSorted = require('jest-sorted')

afterAll(() => {
  db.end()
})

beforeEach(() => {
  return seed({ topicData, userData, articleData, commentData })
})

describe('GET:200 /api/healthcheck', () => {
  test('makes correct 200 connection on a basic endpoint to check the health of the API', () => {
    return request(app).get('/api/healthcheck').expect(200)
  })
})

describe('GET:200 /api/topics', () => {
  test('endpoint returns all topics as an array with slug and description', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toEqual(topicData.length)
        topics.forEach((topic) => {
          expect(topic).toHaveProperty('description')
          expect(topic).toHaveProperty('slug')
        })
      })
  })
  test('provides error for incorrect api path spelling', () => {
    return request(app)
      .get('/api/topicsincorrect')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('incorrect path - path not found')
      })
  })
})

describe('GET:200 /api', () => {
  test('should respond with an object containing all endpoints', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body: { data } }) => {
        expect(data).toMatchObject(endpointFile)
      })
  })
})

describe('GET:200 /GET/api/articles/:article_id', () => {
  test('should respond with an object matching the correct article id entry', () => {
    return request(app)
      .get('/api/articles/5')
      .expect(200)
      .then(({ body: article }) => {
        expect(article).toMatchObject({
          article5: {
            article_id: 5,
            title: 'UNCOVERED: catspiracy to bring down democracy',
            topic: 'cats',
            author: 'rogersop',
            body: 'Bastet walks amongst us, and the cats are taking arms!',
            article_img_url:
              'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
          },
        })
      })
  })
  test('should return correct error when wrong article_id provided', () => {
    return request(app)
      .get('/api/articles/999999999999')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request - outside range')
      })
  })
  test('should return correct error when wrong article_id provided', () => {
    return request(app)
      .get('/api/articles/99')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found')
      })
  })
  test('should handle bad requests', () => {
    return request(app)
      .get('/api/articles/whoopsie')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request')
      })
  })
})

describe('GET:200 /api/articles', () => {
  test('should return all articles with the correct properties', () => {
    const correctProperties = [
      'author',
      'title',
      'article_id',
      'topic',
      'created_at',
      'votes',
      'article_img_url',
      'comment_count',
    ]
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(Object.keys(article)).toEqual(
            expect.arrayContaining(correctProperties)
          )
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
          expect(article).not.toHaveProperty('body')
          expect(article.article_img_url).toMatch(new RegExp('^https:?'))
        })
        expect(articles).toBeSortedBy('created_at', { descending: true })
      })
  })
})
describe('GET: /api/articles/:article_id/comments', () => {
  test('should provide all comments for an article by its Id', () => {
    const testFilter = commentData.filter((comment) => comment.article_id === 3)
    return request(app)
      .get('/api/articles/3/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(testFilter.length)
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 3,
          })
        })
        expect(comments).toBeSortedBy('created_at', { descending: false })
      })
  })
  test('should handle non-existant ID request', () => {
    return request(app)
      .get('/api/articles/99/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found')
      })
  })
  test('should handle non-existant comments request', () => {
    return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({ comments: [] })
      })
  })
  test('should handle incorrect id entry', () => {
    return request(app)
      .get('/api/articles/incorrect/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request')
      })
  })
})

describe('POST /api/articles/:article_id/comments', () => {
  const postObj = {
    username: 'butter_bridge',
    body: 'this is a test comment to add to article 2',
  }
  const wrongPost1 = {
    username: 'thisIsNotAUser',
    body: 'this is a test comment',
  }
  const wrongPost2 = {
    username: 'butter_bridge',
  }
  test('should allow posting of a comment to an article by its id', () => {
    return request(app)
      .post('/api/articles/2/comments')
      .send(postObj)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: 19,
          author: 'butter_bridge',
          body: 'this is a test comment to add to article 2',
          article_id: 2,
          created_at: expect.any(String),
          votes: 0,
        })
      })
  })
  test('should return correct error when wrong article_id provided', () => {
    return request(app)
      .post('/api/articles/99/comments')
      .send(postObj)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found')
      })
  })
  test('should handle bad requests', () => {
    return request(app)
      .post('/api/articles/noarticleid/comments')
      .send(postObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request')
      })
  })
  test('should send correct error back when user not found', () => {
    return request(app)
      .post('/api/articles/2/comments')
      .send(wrongPost1)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request')
      })
  })
  test('should send error when body not included', () => {
    return request(app)
      .post('/api/articles/2/comments')
      .send(wrongPost2)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request')
      })
  })
})

describe('PATCH: /api/articles/:article_id', () => {
  const incVotes = { inc_votes: 20 }
  const wrongVote = { notcorrect: 'incorrect' }
  const reduceVotes = { inc_votes: -200 }
  const wrongData = { inc_votes: 'wrong' }
  test('should be able to update an article votes by its id', () => {
    return request(app)
      .patch('/api/articles/5')
      .send(incVotes)
      .expect(200)
      .then(
        ({
          body: {
            article: [updatedArticle],
          },
        }) => {
          expect(updatedArticle).toMatchObject({
            article_id: 5,
            title: 'UNCOVERED: catspiracy to bring down democracy',
            topic: 'cats',
            author: 'rogersop',
            body: 'Bastet walks amongst us, and the cats are taking arms!',
            created_at: '2020-08-03T13:14:00.000Z',
            article_img_url:
              'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
            votes: 20,
          })
        }
      )
  })
  test('should handle incorrect id', () => {
    return request(app)
      .patch('/api/articles/noarticleid')
      .send(incVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request')
      })
  })
  test('should send correct error back when patch object incorrect', () => {
    return request(app)
      .patch('/api/articles/2')
      .send(wrongVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request')
      })
  })
  test('should work with minus votes', () => {
    return request(app)
      .patch('/api/articles/5')
      .send(reduceVotes)
      .expect(200)
      .then(
        ({
          body: {
            article: [updatedArticle],
          },
        }) => {
          expect(updatedArticle).toMatchObject({
            article_id: 5,
            title: 'UNCOVERED: catspiracy to bring down democracy',
            topic: 'cats',
            author: 'rogersop',
            body: 'Bastet walks amongst us, and the cats are taking arms!',
            created_at: '2020-08-03T13:14:00.000Z',
            article_img_url:
              'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
            votes: -200,
          })
        }
      )
  })
  test('Should send correct response when given non-existent but valid endpoint', () => {
    return request(app)
      .patch('/api/articles/99')
      .send(incVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found')
      })
  })
  test('should send correct error back when patch object sends wrong data', () => {
    return request(app)
      .patch('/api/articles/2')
      .send(wrongData)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request')
      })
  })
})

describe('GET /api/comments', () => {
  test('should return all comments', () => {
    return request(app)
      .get('/api/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          })
        })
      })
  })
})

describe('DELETE /api/comments/:comment_id', () => {
  test('should delete a given comment by the comment_id and respond with 204 no content.', () => {
    let startingNumOfComments = 18
    return request(app)
      .delete('/api/comments/1')
      .expect(204)
      .then(() => {
        return request(app)
          .get('/api/comments')
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments.length).toBeLessThan(startingNumOfComments)
          })
      })
  })
  test('should get correct response for incorrect id', () => {
    return request(app)
      .delete('/api/comments/99')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found')
      })
  })
  test('should handle bad requests', () => {
    return request(app)
      .delete('/api/comments/whoopsie')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request')
      })
  })
})

describe('GET /api/users', () => {
  test('should return all users on an object of users', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body: { users } }) => {
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          })
          expect(user.avatar_url).toMatch(new RegExp('^https:?'))
        })
      })
  })
})

describe('GET /api/articles/:article_id - comment_count', () => {
  test('articles searched by ID should also include the comment_count', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body: { article1 } }) => {
        expect(article1.comment_count).toBe(11)
      })
  })
})
describe('GET /api/articles sorting quries sort_by and order', () => {
  test('allows a sort_by query eg /api/articles?sort_by=votes ', () => {
    return request(app)
      .get('/api/articles?sort_by=votes')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy('votes', { descending: true })
      })
  })
  test('allows a order query eg /api/articles?order=ASC ', () => {
    return request(app)
      .get('/api/articles?order=ASC')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy('created_at', { descending: false })
      })
  })
  test('should provide right error when passed incorrect catagory', () => {
    return request(app)
      .get('/api/articles?sort_by=error')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request')
      })
  })
  test('should provide error when passed incorrect order', () => {
    return request(app)
      .get('/api/articles?order=error')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request')
      })
  })
  test('should provide error when passed invalid query', () => {
    return request(app)
      .get('/api/articles?invalid=error')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request')
      })
  })
})

describe('GET topic query on articles eg /api/articles?topic=cats', () => {
  test('should return all articles of a topic', () => {
    return request(app)
      .get('/api/articles?topic=cats')
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article.topic).toBe('cats')
        })
      })
  })
  test('should give back empty object for a topic that isnt used yet', () => {
    return request(app)
      .get('/api/articles?topic=empty')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toEqual([])
      })
  })
  test('should give back error for a topic is invalid', () => {
    return request(app)
      .get('/api/articles?topic=invalidentry')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found')
      })
  })
})

describe('GET users by username /api/users/:username', () => {
  test('should return user based on username', () => {
    return request(app)
      .get('/api/users/rogersop')
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toEqual({
          username: 'rogersop',
          name: 'paul',
          avatar_url:
            'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4',
        })
      })
  })
  test('should give back error for a username that isnt found', () => {
    return request(app)
      .get('/api/users/theinvisiblemannotfound')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found')
      })
  })
})

describe('GET comment by comment id /api/comments/:comment_id', () => {
  test('should return the correct comment by id', () => {
    return request(app)
      .get('/api/comments/3')
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual({
          comment_id: 3,
          article_id: 1,
          author: 'icellusedkars',
          body: 'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
          created_at: '2020-03-01T01:13:00.000Z',
          votes: 100,
        })
      })
  })
  test('should send error with incorrect id', () => {
    return request(app)
      .get('/api/comments/99')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not Found')
      })
  })
  test('should send error with wrong kind of id', () => {
    return request(app)
      .get('/api/comments/incorrect')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request')
      })
  })
})

describe('PATCH /api/comments/:comment_id', () => {
  const vote1 = { inc_votes: 1 }
  const vote2 = { inc_votes: -1 }
  const wrongVote = { wrong: 1 }
  const wrongData = { inc_votes: 'what' }
  test('should allow the changing of votes to comment by comment id', () => {
    return request(app)
      .patch('/api/comments/3')
      .send(vote1)
      .expect(200)
      .then(
        ({
          body: {
            comment: [updatedComment],
          },
        }) => {
          expect(updatedComment).toEqual({
            comment_id: 3,
            article_id: 1,
            author: 'icellusedkars',
            body: 'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
            created_at: '2020-03-01T01:13:00.000Z',
            votes: 101,
          })
        }
      )
  })
  test('should allow the reduction of votes to comment by comment id', () => {
    return request(app)
      .patch('/api/comments/3')
      .send(vote2)
      .expect(200)
      .then(
        ({
          body: {
            comment: [updatedComment],
          },
        }) => {
          expect(updatedComment).toEqual({
            comment_id: 3,
            article_id: 1,
            author: 'icellusedkars',
            body: 'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
            created_at: '2020-03-01T01:13:00.000Z',
            votes: 99,
          })
        }
      )
  })
  test('should handle incorrect id', () => {
    return request(app)
      .patch('/api/comments/noarticleid')
      .send(vote1)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request')
      })
  })
  test('should send correct error back when patch object incorrect', () => {
    return request(app)
      .patch('/api/comments/2')
      .send(wrongVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request')
      })
  })
  test('should send correct error back when patch object sends wrong data', () => {
    return request(app)
      .patch('/api/comments/2')
      .send(wrongData)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request')
      })
  })
})

describe('POST allows posting of articles /api/articles ', () => {
  const newArticle = {
    author: 'butter_bridge',
    title: 'this is a new article',
    body: "well isn't it nice to get a new article in here",
    topic: 'paper',
  }
  const badArticle = {
    wrongname: 'butter_bridge',
    notitle: 'this is a new article',
    incorrect: "well isn't it nice to get a new article in here",
    whatisthis: 'paper',
  }
  const badContent = {
    author: 'butter_bridge',
    title: 1,
    body: 10000,
    topic: 'this is not a topic and should be rejected',
  }
  test('should allow posting of an article', () => {
    return request(app)
      .post('/api/articles')
      .send(newArticle)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 14,
          author: 'butter_bridge',
          title: 'this is a new article',
          body: "well isn't it nice to get a new article in here",
          topic: 'paper',
          votes: 0,
          created_at: expect.any(String),
          comment_count: 0,
          article_img_url:
            'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700',
        })
      })
  })
  test('should send correct error when passed object with incorrect keys', () => {
    return request(app)
      .post('/api/articles')
      .send(badArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request')
      })
  })
  test('should send correct error when passed object with incorrect values', () => {
    return request(app)
      .post('/api/articles')
      .send(badContent)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request')
      })
  })
})

describe('GET /api/articles/pagination and limit', () => {
  test('allows a limit to be set via query to the articles', () => {
    return request(app)
      .get('/api/articles?limit=3')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(3)
      })
  })
  test('should not allow a limit over 50 to be set', () => {
    return request(app)
      .get('/api/articles?limit=55')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request - limit too high max 50')
      })
  })
  test('should prevent improper input', () => {
    return request(app)
      .get('/api/articles?limit=criticaldamage')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request')
      })
  })
  test('allows a page to be set to the articles', () => {
    return request(app)
      .get('/api/articles?p=2')
      .expect(200)
      .then(({ body: { articles, total_count } }) => {
        expect(articles.length).toBe(3)
        expect(articles[2]).toEqual({
          article_id: 7,
          article_img_url:
            'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
          author: 'icellusedkars',
          comment_count: '0',
          created_at: '2020-01-07T14:08:00.000Z',
          title: 'Z',
          topic: 'mitch',
          votes: 0,
        })
        expect(total_count).toBe(13)
      })
  })
  test('should error when the page number is too high', () => {
    return request(app)
      .get('/api/articles?p=100')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request')
      })
  })
})

describe('GET /api/articles/:article_id/comments pagination and limit ', () => {
  test('should allow a limit to be set on the return', () => {
    return request(app)
      .get('/api/articles/1/comments?limit=2')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toEqual(2)
      })
  })
  test('should allow a pagination to be set', () => {
    return request(app)
      .get('/api/articles/1/comments?p=2')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toEqual(1)
      })
  })
  test('should return error on incorrect query', () => {
    return request(app)
      .get('/api/articles/1/comments?wrong=2')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request')
      })
  })
  test('should not allow a limit over 50 to be set', () => {
    return request(app)
      .get('/api/articles/1/comments?limit=55')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request - limit too high max 50')
      })
  })
  test('should prevent improper input', () => {
    return request(app)
      .get('/api/articles/1/comments?limit=criticaldamage')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request')
      })
  })
  test('should error when the page number is too high', () => {
    return request(app)
      .get('/api/articles/1/comments?p=100')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request')
      })
  })
})
