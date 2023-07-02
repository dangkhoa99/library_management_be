const express = require('express')
const authController = require('../controllers/auth.controller')
const verifyToken = require('../middleware/verifyToken.middleware')

const router = express.Router()

router.post('/signUp', authController.signUp)

router.post('/signIn', authController.signIn)

router.post('/whoAmI', verifyToken, authController.whoAmI)

module.exports = router
