const { Statuses } = require('../common/constants/constants')
const Book = require('../models/book.model')

// access: private
const BookController = {
  // GET /books
  list: async (req, res) => {
    try {
      const books = await Book.find({ isDeleted: false })
        .populate({ path: 'category', select: ['_id', 'name'] })
        .populate({ path: 'user', select: ['_id', 'name'] })
        .sort({ createdAt: 'desc' })
        .select('-isDeleted')
      res.status(200).json(books)
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },

  // GET /books/:id
  show: async (req, res) => {
    try {
      const book = await Book.findById(req.params.id)
        .populate({ path: 'category', select: ['_id', 'name'] })
        .populate({ path: 'user', select: ['_id', 'name'] })

      res.status(200).json(book)
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },

  // POST /books
  create: async (req, res) => {
    try {
      const book = await Book.create(req.body)
      res.status(201).json(book)
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },

  // PATCH /books/:id
  edit: async (req, res) => {
    try {
      const updateBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })

      res.status(200).json(updateBook)
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },

  // DELETE /books/:id
  delete: async (req, res) => {
    try {
      const existBook = await Book.findById(req.params.id)

      if (!existBook || existBook.isDeleted) {
        return res.status(404).json({
          message: 'Book not found',
          status: Statuses.ERROR,
          code: 404,
        })
      }

      await Book.updateOne(
        { _id: req.params.id },
        { isDeleted: true },
        { new: true },
      )

      res.status(200).json({
        message: `Delete success book with id: ${req.params.id}`,
        status: Statuses.SUCCESS,
        code: 200,
      })
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },
}

module.exports = BookController
