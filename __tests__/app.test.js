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
        return request(app).get('/api/topics').expect(200).then(({body})=>{
            body.forEach((topic)=>{
                expect(Object.keys(topic)).toContain('description')
                expect(Object.keys(topic)).toContain('slug')
            })
        })
    });
});