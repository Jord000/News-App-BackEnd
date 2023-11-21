const app = require('../MVC/app.js');
const seed = require('../db/seeds/seed.js');
const request = require('supertest');
const db = require('../db/connection.js');
const {
  userData,
  topicData,
  commentData,
  articleData,
} = require('../db/data/test-data/index.js');
const endpointFile = require('../endpoints.json');

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed({ topicData, userData, articleData, commentData });
});

describe('GET:200 /api/healthcheck', () => {
  test('makes correct 200 connection on a basic endpoint to check the health of the API', () => {
    return request(app).get('/api/healthcheck').expect(200);
  });
});

describe('GET:200 /api/topics', () => {
  test('endpoint returns all topics as an array with slug and description', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toEqual(topicData.length);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty('description');
          expect(topic).toHaveProperty('slug');
        });
      });
  });
  test('provides error for incorrect api path spelling', () => {
    return request(app)
      .get('/api/topicsincorrect')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual('incorrect path - path not found');
      });
  });
});

describe('GET:200 /api', () => {
  test('should respond with an object containing all endpoints', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body: { data } }) => {
        expect(data).toMatchObject(endpointFile);
      });
  });
});

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
        });
      });
  });
  test('should return correct error when wrong article_id provided', () => {
    return request(app)
      .get('/api/articles/999999999999')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual('Bad Request - outside range');
      });
  });
  test.only('should return correct error when wrong article_id provided', () => {
    return request(app)
      .get('/api/articles/99')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual('Not Found');
      });
  });
  test('should handle bad requests', () => {
    return request(app)
      .get('/api/articles/whoopsie')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual('Bad Request');
      });
  });
});
