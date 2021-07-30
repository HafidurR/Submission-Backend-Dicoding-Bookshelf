const bookshelf = require('./bookshelf')
const { nanoid } = require('nanoid')

const addBookshelfHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  } else if (pageCount < readPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  } else {
    const id = nanoid(16)
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt
    const finished = pageCount === readPage

    const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt }
    bookshelf.push(newBook)

    const isSuccess = bookshelf.filter((note) => note.id === id).length > 0

    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id
        }
      })
      response.code(201)
      return response
    }
  }
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getAllBooksHandler = (request, h) => {
  const {
    name,
    reading,
    finished
  } = request.query

  if (name !== undefined) {
    const BooksName = bookshelf.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
    const response = h.response({
      status: 'success',
      data: {
        books: BooksName.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
    response.code(200)
    return response
  } else if (reading !== undefined) {
    const BooksReading = bookshelf.filter(
      (book) => Number(book.reading) === Number(reading)
    )
    const response = h.response({
      status: 'success',
      data: {
        books: BooksReading.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
    response.code(200)
    return response
  } else if (finished !== undefined) {
    const BooksFinished = bookshelf.filter(
      // eslint-disable-next-line eqeqeq
      (book) => book.finished == finished
    )
    const response = h.response({
      status: 'success',
      data: {
        books: BooksFinished.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
    response.code(200)
    return response
  } else {
    const response = h.response({
      status: 'success',
      data: {
        books: bookshelf.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
    response.code(200)
    return response
  }
}

const getDetailsbookshelf = (request, h) => {
  const { bookId } = request.params

  const book = bookshelf.filter((n) => n.id === bookId)[0]

  if (book) {
    const response = h
      .response({
        status: 'success',
        data: {
          book
        }
      }).code(200)
    return response
  }

  const response = h
    .response({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    }).code(404)
  return response
}

const editBookshelfHandler = (request, h) => {
  const { bookId } = request.params

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  if (!name) {
    const response = h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku'
      }).code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h
      .response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      }).code(400)
    return response
  }

  const finished = pageCount === readPage
  const updatedAt = new Date().toISOString()

  const index = bookshelf.findIndex((note) => note.id === bookId)

  if (index !== -1) {
    bookshelf[index] = {
      ...bookshelf[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt
    }

    const response = h
      .response({
        status: 'success',
        message: 'Buku berhasil diperbarui'
      })
      .code(200)
    return response
  }

  const response = h
    .response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    }).code(404)
  return response
}

const deleteBookshelfByIdHandler = (request, h) => {
  const { bookId } = request.params

  const index = bookshelf.findIndex((note) => note.id === bookId)

  if (index !== -1) {
    bookshelf.splice(index, 1)

    const response = h
      .response({
        status: 'success',
        message: 'Buku berhasil dihapus'
      }).code(200)
    return response
  }

  const response = h
    .response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    }).code(404)
  return response
}

module.exports = {
  addBookshelfHandler,
  getAllBooksHandler,
  getDetailsbookshelf,
  editBookshelfHandler,
  deleteBookshelfByIdHandler
}
