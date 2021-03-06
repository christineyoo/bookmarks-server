const express = require('express');
const { v4: uuid } = require('uuid');
const { bookmarks } = require('../store.js');
const winston = require('winston');
const { NODE_ENV } = require('../config');
const BookmarksService = require('../bookmarksService');
const xss = require('xss');

const bookmarkRouter = express.Router();
const bodyParser = express.json();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: 'info.log' })]
});

if (NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}

bookmarkRouter
  .route('/bookmarks')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    BookmarksService.getAllBookmarks(knexInstance)
      .then((bookmarks) => res.json(bookmarks))
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { title, url, description, rating } = req.body;

    if (!title) {
      logger.error('Title is required');
      return res.status(400).send('Invalid data');
    }

    if (!url) {
      logger.error('url is required');
      return res.status(400).send('Invalid data');
    }

    if (!description) {
      logger.error('Description is required');
      return res.status(400).send('Invalid data');
    }

    if (!rating) {
      logger.error('Rating is required');
      return res.status(400).send('Invalid data');
    }

    const id = uuid();
    const bookmark = {
      id,
      title,
      url,
      description,
      rating
    };

    bookmarks.push(bookmark);
    logger.info(`Bookmark with id ${id} created.`);
    const newBookmark = { title, url, description, rating };

    for (const [key, value] of Object.entries(newArticle)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }
    BookmarksService.insertBookmark(req.app.get('db'), newBookmark)
      .then((bookmark) => {
        res.status(201).location(`/bookmarks/${bookmark.id}`).json(bookmark);
      })
      .catch(next);
  });

bookmarkRouter
  .route('/bookmarks/:id')
  .all((req, res, next) => {
    BookmarksService.getById(req.app.get('db'), req.params.id)
      .then((bookmark) => {
        if (!bookmark) {
          logger.error(`Bookmark with id ${id} not found.`);
          return res.status(404).json({
            error: { message: `Bookmark doesn't exist` }
          });
        }
        res.bookmark = bookmark //save the bookmark for the next middleware
        next(); //calling next so that the next middleware happens
        
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json({
          id: bookmark.id,
          title: xss(bookmark.title), //sanitize the title
          url: xss(bookmark.url), //sanitize the url
          description: xss(bookmark.description), //sanitize the description
          rating: bookmark.rating
        });
  })
  .delete((req, res, next) => {
    const { id } = req.params;
    const bookmarkIndex = bookmarks.findIndex((i) => i.id == id);

    if (bookmarkIndex === -1) {
      logger.error(`List with id ${id} not found.`);
      return res.status(400).send('Not found');
    }

    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`List with id ${id} deleted`);
    BookmarksService.deleteBookmark(req.app.get('db'), req.params.id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = bookmarkRouter;
