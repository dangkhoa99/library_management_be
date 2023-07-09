const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    quantity: { type: Number, default: 1 },
    publisher: { type: String },
    publishDate: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Book', bookSchema)
