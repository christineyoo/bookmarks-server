const BookmarksService = {
  getAllBookmarks(knex) {
    return knex.select('*').from('bookmark_table');
  },
  getById(knex, id) {
    return knex.from('bookmark_table').select('*').where('id', id).first();
  },
  insertBookmark(knex, newBookmark) {
    return knex
      .insert(newBookmark)
      .into('bookmark_table')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  }
};

module.exports = BookmarksService;
