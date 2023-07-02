const mongoose = require('mongoose')

async function connect() {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('Connect to MongoDB')
  } catch (error) {
    console.log('Connection error: ', error)
  }
}

module.exports = { connect }
