const express = require('express')
const router = express.Router()
const Borrow = require('../controllers/borrow.controller')
const verifyToken = require('../middleware/verifyToken.middleware')

router.use(verifyToken)

router.get('/', Borrow.list)
router.get('/:id', Borrow.show)

router.post('/', Borrow.create)
router.post('/count', Borrow.listCount)

router.patch('/:id', Borrow.edit)
router.patch('/:id/changeStatus', Borrow.editStatus)

router.delete('/:id', Borrow.delete)

module.exports = router
