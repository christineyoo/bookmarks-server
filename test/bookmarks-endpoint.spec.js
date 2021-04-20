const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makeBookmarksArray } = require('./bookmarks.fixtures');

describe('Bookmarks Endpoints', function () {
  let db;

  before('Make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.DB_TEST_URL
    });
  });

  app.set('db', db);

  after('Disconnect from db', () => db.destroy());

  before('Clean the table', () => db('bookmark_table').truncate());

  afterEach('Cleanup', () => db('bookmark_table').truncate());

  describe('GET /bookmarks', () => {
    context('Given no bookmarks', () => {
      it('Responds with 200 and an empty list', () => {
        return supertest(app).get('/bookmarks').expect(200, []);
      });
    });

    context('Given there are bookmarks in the database', () => {
      const testBookmarks = makeBookmarksArray();

      beforeEach('Insert bookmarks', () => {
        return db.into('bookmark_table').insert(testBookmarks);
      });

      it('GET /articles responds with 200 and all of the bookmarks', () => {
        return supertest(app).get('/bookmarks').expect(200, testBookmarks);
      });
    });
  });

  describe('GET /bookmarks/:id', () => {
    context('Given no bookmarks', () => {
      it('Responds with 404', () => {
        const bookmarkId = 123456;
        return supertest(app)
          .get(`/bookmarks/${bookmarkId}`)
          .expect(404, 'Bookmark not found.');
      });
    });
    context('Given there are bookmarks in the database', () => {
      const testBookmarks = makeBookmarksArray();

      beforeEach('Insert bookmarks', () => {
        return db.into('bookmark_table').insert(testBookmarks);
      });

      it('GET /bookmarks/:id responds with 200 and the specified bookmark', () => {
        const bookmarkId = 2;
        const expectedBookmark = testBookmarks[bookmarkId - 1];
        return supertest(app)
          .get(`/bookmarks/${bookmarkId}`)
          .expect(200, expectedBookmark);
      });
    });
  });

  describe.only('POST /bookmarks', () => {
    it('creates a bookmark, responding with 201 and the new article', function () {
      const newBookmark = {
        title: 'Test new bookmark',
        url: 'www.newbookmark.com',
        description: 'Test new bookmark description...',
        rating: 1
      };
      return supertest(app)
        .post('/bookmarks')
        .send({
          title: 'Test new bookmark',
          url: 'www.newbookmark.com',
          description: 'Test new bookmark description...',
          rating: 1
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.title.to.eql(newBookmark.title));
          expect(res.body.url.to.eql(newBookmark.url));
          expect(res.body.description.to.eql(newBookmark.description));
          expect(res.body.rating.to.eql(newBookmark.rating));
          expect(res.body).to.have.property('id');
        })
        .then((postRes) => supertest(app))
        .get(`/articles/${postRes.body.id}`)
        .expect(postRes.body);
    });
  });
});
