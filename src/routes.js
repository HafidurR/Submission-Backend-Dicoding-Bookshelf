const {
  addBookshelfHandler,
  getAllBooksHandler,
  getDetailsbookshelf,
  editBookshelfHandler,
  deleteBookshelfByIdHandler
} = require('./handler')

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookshelfHandler
  },

  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler
  },

  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getDetailsbookshelf
  },

  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookshelfHandler
  },

  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookshelfByIdHandler
  }
]

module.exports = routes
