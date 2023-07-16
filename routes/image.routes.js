const express = require('express')
const router = express.Router()
const Image = require('../controllers/image.controller')
const verifyToken = require('../middleware/verifyToken.middleware')
const upload = require('../common/utils/multer')

router.use(verifyToken)

router.post('/uploadImage', upload.single('image'), Image.create)

module.exports = router
