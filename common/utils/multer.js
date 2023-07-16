const multer = require('multer')
const path = require('path')
const { MAX_FILE_SIZE } = require('../constants/constants')

// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 1024 * MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname)

    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      cb(new Error('Unsupported file type!'), false)
      return
    }
    cb(null, true)
  },
})
