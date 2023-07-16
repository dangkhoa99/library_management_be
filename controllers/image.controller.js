const { Statuses } = require('../common/constants/constants')
const Image = require('../models/image.model')
const cloudinary = require('../common/utils/cloudinary')

// access: private
const ImageController = {
  // POST /images/uploadImage
  create: async (req, res) => {
    try {
      // Upload image to cloudinary
      console.log('RUN')
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'TDTU',
      })

      const image = await Image.create({
        link: result.url,
        cloudinaryId: result.public_id,
      })

      res.status(201).json(image)
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },
}

module.exports = ImageController
