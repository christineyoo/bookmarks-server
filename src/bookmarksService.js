const BookmarksService = {
  getAllBookmarks(knex) {
    return knex.select('*').from('bookmark_table');
  },
  getById(knex, id) {
    return knex.from('bookmark_table').select('*').where('id', id).first();
  }
};

module.exports = BookmarksService;
