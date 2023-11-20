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
const { forEach } = require('../db/data/test-data/articles.js')
const endpointFile = require('../endpoints.json')

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
        expect(response.body.msg).toEqual('incorrect path - path not found')
      })
  })
})

describe('GET:200 /api', () => {
  test('should respond with an object containing all endpoints', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body: { data } }) => {
        expect(data).toMatchObject(endpointFile
        )
      })
  })
})


