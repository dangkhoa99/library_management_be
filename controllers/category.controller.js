const { Statuses } = require('../common/constants/constants')
const Category = require('../models/category.model')

// access: private
const CategoryController = {
  // GET /categories
  list: async (req, res) => {
    try {
      const categories = await Category.find({ isDeleted: false })
        .sort({ createdAt: 'desc' })
        .select('-isDeleted')
      res.status(200).json(categories)
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },

  // GET /categories/:id
  show: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id)
      res.status(200).json(category)
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },

  // POST /categories
  create: async (req, res) => {
    try {
      const category = await Category.create(req.body)
      res.status(201).json(category)
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },

  // PATCH /categories/:id
  edit: async (req, res) => {
    try {
      const updateCategory = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      )

      res.status(200).json(updateCategory)
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },

  // DELETE /categories/:id
  delete: async (req, res) => {
    try {
      const existCategory = await Category.findById(req.params.id)

      if (!existCategory || existCategory.isDeleted) {
        return res.status(404).json({
          message: 'Category not found',
          status: Statuses.ERROR,
          code: 404,
        })
      }

      await Category.updateOne(
        { _id: req.params.id },
        { isDeleted: true },
        { new: true },
      )

      return res.status(200).json({ id: req.params.id })
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },
}

module.exports = CategoryController
