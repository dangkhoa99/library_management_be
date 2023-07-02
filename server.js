require('dotenv').config()
const express = require('express')
const cors = require('cors')
const db = require('./configs/dbConnection')

const app = express()
const port = process.env.PORT || 5000

db.connect()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`),
)
