const mongoose = require('mongoose')
const Schema = mongoose.Schema

const imageSchema = new Schema(
  {
    link: { type: String },
    cloudinaryId: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Image', imageSchema)
