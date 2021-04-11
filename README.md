# Bookmarks Server

## About

This is a simple API for the Bookmarks client that supports GET, POST, and DELETE.
There are four endpoints:

1. `GET /bookmarks` returns a list of bookmarks
2. `GET bookmarks/:id` returns a single bookmark with the given ID
3. `POST bookmarks` accepts a JSON object representing a bookmark and adds it to the list of bookmarks after validation
- The request body must include a title (string), url (string), description (string), and rating (number)
5. `DELETE bookmarks/:id` deletes a bookmark with the given ID

## Other things used

- Winston logging library
- Express routing
