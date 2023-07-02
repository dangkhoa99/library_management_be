const mongoose = require('mongoose')
const Schema = mongoose.Schema

const accountSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Account', accountSchema)
