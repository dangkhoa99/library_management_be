const express = require('express')
const router = express.Router()
const User = require('../controllers/user.controller')
const verifyToken = require('../middleware/verifyToken.middleware')

router.use(verifyToken)

router.get('/', User.list)
router.get('/authors', User.listAuthor)
router.get('/authors/count', User.listAuthorCount)
router.get('/customers', User.listCustomer)
router.get('/customers/count', User.listCustomerCount)
router.get('/librarians', User.listLibrarian)
router.get('/:id', User.show)

router.post('/', User.create)
router.post('/authors', User.createAuthor)
router.post('/customers', User.createCustomer)
router.post('/librarians', User.createLibrarian)
router.post('/changePassword', User.changePassword)

router.patch('/:id', User.edit)

router.delete('/:id', User.delete)

module.exports = router
