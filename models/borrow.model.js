const mongoose = require('mongoose')
const { Statuses } = require('../common/constants/constants')
const Schema = mongoose.Schema

const borrowSchema = new Schema(
  {
    librarian: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    books: [
      {
        book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    borrowDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    status: { type: String, required: true, default: Statuses.CHECKED_OUT },
    note: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Borrow', borrowSchema)
