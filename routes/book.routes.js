const express = require('express')
const router = express.Router()
const Book = require('../controllers/book.controller')
const verifyToken = require('../middleware/verifyToken.middleware')

router.use(verifyToken)

router.get('/', Book.list)
router.get('/:id', Book.show)
router.post('/', Book.create)
router.patch('/:id', Book.edit)
router.delete('/:id', Book.delete)

module.exports = router
