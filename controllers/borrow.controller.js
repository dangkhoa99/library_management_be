const { Statuses } = require('../common/constants/constants')
const Borrow = require('../models/borrow.model')
const Book = require('../models/book.model')

// access: private
const BorrowController = {
  // GET /borrows
  list: async (req, res) => {
    try {
      const borrows = await Borrow.find({ isDeleted: false })
        .sort({ createdAt: 'desc' })
        .populate({ path: 'customer', select: ['_id', 'name'] })
        .populate({ path: 'librarian', select: ['_id', 'name', 'role'] })
        .select('-isDeleted')

      res.status(200).json(borrows)
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },

  // POST /borrows/count
  listCount: async (req, res) => {
    const { status } = req.body

    if (!status) {
      return res.status(400).json({
        message: 'Status is required',
        status: Statuses.ERROR,
        code: 400,
      })
    }

    try {
      const borrows = await Borrow.find({ status: status })
      const count = borrows.length

      res.status(200).json({ count })
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },

  // GET /borrows/:id
  show: async (req, res) => {
    try {
      const borrow = await Borrow.findById(req.params.id)
        .populate({ path: 'customer', select: ['_id', 'name'] })
        .populate({ path: 'librarian', select: ['_id', 'name', 'role'] })
        .populate({
          path: 'books.book',
          select: ['_id', 'name'],
          populate: [
            { path: 'author', select: ['_id', 'name'] },
            { path: 'category', select: ['_id', 'name'] },
            { path: 'image', select: ['_id', 'link'] },
          ],
        })
        .select('-isDeleted')

      res.status(200).json(borrow)
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },

  // POST /borrows
  create: async (req, res) => {
    const { id } = req.user
    const { books } = req.body

    if (books && books.length > 0) {
      // Check quantity in Book > quantity borrow
      const isContinue = books.every(({ book: bookId, quantity }) =>
        Book.findById(bookId)
          .then((p) => p.quantity - quantity > 0)
          .catch((err) =>
            res.status(400).json({
              message: err.message,
              status: Statuses.ERROR,
              code: 400,
            }),
          ),
      )

      // Create a new borrow and subtract quantity in Book
      if (isContinue) {
        Borrow.create({ ...req.body, librarian: id })
          .then((newBorrow) => {
            books.forEach(({ book: bookId, quantity }) => {
              return Book.findById(bookId)
                .then((p) => {
                  p.quantity = p.quantity - quantity
                  p.save()
                })
                .catch((err) =>
                  res.status(400).json({
                    message: err.message,
                    status: Statuses.ERROR,
                    code: 400,
                  }),
                )
            })

            res.status(201).json(newBorrow)
          })
          .catch((error) => {
            res.status(500).json({
              message: error.message,
              status: Statuses.ERROR,
              code: 500,
            })
          })
      }
    }
  },

  // PATCH /borrows/:id
  edit: async (req, res) => {
    try {
      const updateBorrow = await Borrow.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      )

      res.status(200).json(updateBorrow)
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },

  // PATCH /borrows/:id/changeStatus
  editStatus: async (req, res) => {
    Borrow.findById(req.params.id)
      .then((o) => {
        o.status = req.body.status

        // Statues = RETURNED => return quantity in Book
        if (req.body.status === Statuses.RETURNED) {
          const books = o.books

          books.forEach(({ book: bookId, quantity }) => {
            return Book.findById(bookId)
              .then((p) => {
                p.quantity = p.quantity + quantity
                p.save()
              })
              .catch((err) =>
                res.status(400).json({
                  message: err.message,
                  status: Statuses.ERROR,
                  code: 400,
                }),
              )
          })
        }

        o.save()
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: err.message, status: Statuses.ERROR, code: 500 })
      })

    try {
      const updateBorrow = await Borrow.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      )

      res.status(200).json(updateBorrow)
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },

  // DELETE /borrows/:id
  delete: async (req, res) => {
    try {
      const existBorrow = await Borrow.findById(req.params.id)

      if (!existBorrow || existBorrow.isDeleted) {
        return res.status(404).json({
          message: 'Borrow ticket not found',
          status: Statuses.ERROR,
          code: 404,
        })
      }

      await Borrow.updateOne(
        { _id: req.params.id },
        { isDeleted: true },
        { new: true },
      )

      res.status(200).json({
        message: `Delete success borrow ticket with id: ${req.params.id}`,
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

module.exports = BorrowController
