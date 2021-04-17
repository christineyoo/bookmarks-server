const BookmarksService = {
  getAllBookmarks(knex) {
    return knex.select('*').from('bookmarks_table');
  }
};

module.exports = BookmarksService;