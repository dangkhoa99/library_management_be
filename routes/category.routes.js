const express = require('express')
const router = express.Router()
const Category = require('../controllers/category.controller')
const verifyToken = require('../middleware/verifyToken.middleware')

router.use(verifyToken)

router.get('/', Category.list)
router.get('/count', Category.listCount)
router.get('/:id', Category.show)
router.post('/', Category.create)
router.patch('/:id', Category.edit)
router.delete('/:id', Category.delete)

module.exports = router
