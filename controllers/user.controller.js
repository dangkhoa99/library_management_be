const { Statuses, Roles } = require('../common/constants/constants')
const { validateEmail } = require('../common/utils/validateEmail')
const User = require('../models/user.model')
const Account = require('../models/account.model')
const bcrypt = require('bcrypt')

// access: private
const UserController = {
  //----------------------------------------
  // GET /users (all)
  // role: superAdmin/admin
  list: async (req, res) => {
    const { role } = req.user

    if (role !== Roles.ADMIN && role !== Roles.SUPER_ADMIN) {
      return res
        .status(403)
        .json({ message: 'Forbidden', status: Statuses.ERROR, code: 403 })
    }

    try {
      const users = await User.find({ isDeleted: false })
        .sort({ createdAt: 'desc' })
        .select('-isDeleted')

      res.status(200).json(users)
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },

  // GET /users/librarians
  // role: superAdmin/admin
  listLibrarian: async (req, res) => {
    const { role } = req.user

    if (role !== Roles.ADMIN && role !== Roles.SUPER_ADMIN) {
      return res
        .status(403)
        .json({ message: 'Forbidden', status: Statuses.ERROR, code: 403 })
    }

    try {
      const users = await User.find({ isDeleted: false, role: Roles.MANAGER })
        .sort({ createdAt: 'desc' })
        .select('-isDeleted')

      res.status(200).json(users)
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },

  // GET /users/customers
  // role: superAdmin/admin/librarian
  listCustomer: async (req, res) => {
    const { role } = req.user

    if (
      role !== Roles.ADMIN &&
      role !== Roles.SUPER_ADMIN &&
      role !== Roles.MANAGER
    ) {
      return res
        .status(403)
        .json({ message: 'Forbidden', status: Statuses.ERROR, code: 403 })
    }

    try {
      const users = await User.find({ isDeleted: false, role: Roles.USER })
        .sort({ createdAt: 'desc' })
        .select('-isDeleted')

      res.status(200).json(users)
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },

  // GET /users/authors
  // role: superAdmin/admin/librarian
  listAuthor: async (req, res) => {
    const { role } = req.user

    if (
      role !== Roles.ADMIN &&
      role !== Roles.SUPER_ADMIN &&
      role !== Roles.MANAGER
    ) {
      return res
        .status(403)
        .json({ message: 'Forbidden', status: Statuses.ERROR, code: 403 })
    }

    try {
      const users = await User.find({ isDeleted: false, role: Roles.AUTHOR })
        .sort({ createdAt: 'desc' })
        .select('-isDeleted')

      res.status(200).json(users)
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },

  //----------------------------------------
  // GET /users/:id
  show: async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
      res.status(200).json(user)
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },

  //----------------------------------------
  // POST /users
  // role: superadmin/admin
  create: async (req, res) => {
    const { role } = req.user

    if (role === Roles.USER) {
      return res
        .status(403)
        .json({ message: 'Forbidden', status: Statuses.ERROR, code: 403 })
    }

    const { username, password, email } = req.body

    const userExists = await User.findOne({ username })

    if (userExists) {
      return res.status(400).json({
        message: 'Username already exists.',
        status: Statuses.ERROR,
        code: 400,
      })
    }

    if (email || email === '') {
      if (!validateEmail(email)) {
        return res.status(400).json({
          message: 'Invalid email',
          status: Statuses.ERROR,
          code: 400,
        })
      }

      const emailExists = await User.findOne({ email })

      if (emailExists) {
        return res.status(400).json({
          message: 'Email already exists.',
          status: Statuses.ERROR,
          code: 400,
        })
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
      const user = await User.create({
        ...req.body,
        password: hashedPassword,
      })
      res.status(201).json(user)
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },

  // Create Librarian
  // POST /users/librarians
  // role: superAdmin/admin
  createLibrarian: async (req, res) => {
    const { role } = req.user

    if (role !== Roles.ADMIN && role !== Roles.SUPER_ADMIN) {
      return res
        .status(403)
        .json({ message: 'Forbidden', status: Statuses.ERROR, code: 403 })
    }

    const { username, password, ...other } = req.body
    const { email } = other

    const accountExists = await Account.findOne({ username })

    if (accountExists) {
      return res.status(400).json({
        message: 'Username already exists.',
        status: Statuses.ERROR,
        code: 400,
      })
    }

    if (email || email === '') {
      if (!validateEmail(email)) {
        return res.status(400).json({
          message: 'Invalid email',
          status: Statuses.ERROR,
          code: 400,
        })
      }

      const emailExists = await User.findOne({ email })

      if (emailExists) {
        return res.status(400).json({
          message: 'Email already exists.',
          status: Statuses.ERROR,
          code: 400,
        })
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
      const user = await User.create({ ...other })

      await Account.create({
        username,
        password: hashedPassword,
        user: user.id,
      })

      res.status(201).json(user)
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },

  // Create Author
  // POST /users/authors
  // role: superAdmin/admin/librarian
  createAuthor: async (req, res) => {
    const { role } = req.user

    if (
      role !== Roles.ADMIN &&
      role !== Roles.SUPER_ADMIN &&
      role !== Roles.MANAGER
    ) {
      return res
        .status(403)
        .json({ message: 'Forbidden', status: Statuses.ERROR, code: 403 })
    }

    const { email } = req.body

    if (email || email === '') {
      if (!validateEmail(email)) {
        return res.status(400).json({
          message: 'Invalid email',
          status: Statuses.ERROR,
          code: 400,
        })
      }

      const emailExists = await User.findOne({ email })

      if (emailExists) {
        return res.status(400).json({
          message: 'Email already exists.',
          status: Statuses.ERROR,
          code: 400,
        })
      }
    }

    try {
      const user = await User.create({ ...req.body, role: Roles.AUTHOR })
      res.status(201).json(user)
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },

  // Create Customer
  // POST /users/customers
  // role: superAdmin/admin/librarian
  createCustomer: async (req, res) => {
    const { role } = req.user

    if (
      role !== Roles.ADMIN &&
      role !== Roles.SUPER_ADMIN &&
      role !== Roles.MANAGER
    ) {
      return res
        .status(403)
        .json({ message: 'Forbidden', status: Statuses.ERROR, code: 403 })
    }

    const { email } = req.body

    if (email || email === '') {
      if (!validateEmail(email)) {
        return res.status(400).json({
          message: 'Invalid email',
          status: Statuses.ERROR,
          code: 400,
        })
      }

      const emailExists = await User.findOne({ email })

      if (emailExists) {
        return res.status(400).json({
          message: 'Email already exists.',
          status: Statuses.ERROR,
          code: 400,
        })
      }
    }

    try {
      const user = await User.create({ ...req.body, role: Roles.USER })
      res.status(201).json(user)
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },

  //----------------------------------------
  // PATCH /users/:id
  // Role: superAdmin/admin - Can update all user
  edit: async (req, res) => {
    const { id, role } = req.user

    // Role: User - Can only update self
    if (role === Roles.USER) {
      if (req.params.id !== id) {
        return res.status(403).json({
          message: 'Forbidden',
          status: Statuses.ERROR,
          code: 403,
        })
      }
    }

    // Role: Librarian - Can update all role user and self
    if (role === Roles.MANAGER) {
      if (req.params.id !== id) {
        const findUser = await User.findById(req.params.id)

        if (
          findUser.role === Roles.ADMIN ||
          findUser.role === Roles.SUPER_ADMIN ||
          findUser.role === Roles.MANAGER
        ) {
          return res.status(403).json({
            message: 'Forbidden',
            status: Statuses.ERROR,
            code: 403,
          })
        }
      }
    }

    try {
      const { ...other } = req.body

      // Role: user, librarian - Can not update role
      if (other.role) {
        if (role === Roles.USER || role === Roles.MANAGER) {
          return res.status(403).json({
            message: 'Forbidden',
            status: Statuses.ERROR,
            code: 403,
          })
        }
      }

      if (other.email || other.email === '') {
        if (!validateEmail(other.email)) {
          return res.status(400).json({
            message: 'Invalid email',
            status: Statuses.ERROR,
            code: 400,
          })
        }

        const emailExists = await User.findOne({ email: other.email })

        if (emailExists) {
          return res.status(400).json({
            message: 'Email already exists.',
            status: Statuses.ERROR,
            code: 400,
          })
        }
      }

      const updateUser = await User.findByIdAndUpdate(req.params.id, other, {
        new: true,
      })

      res.status(200).json(updateUser)
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },

  //----------------------------------------
  // DELETE /users/:id
  // Role: superAdmin/admin - Can delete all user
  // Role: librarian - Can delete all role user and self
  // Role: user - Can only delete self
  delete: async (req, res) => {
    const { id, role } = req.user

    if (role === Roles.USER) {
      if (req.params.id !== id) {
        return res.status(403).json({
          message: 'Forbidden',
          status: Statuses.ERROR,
          code: 403,
        })
      }
    }

    if (role === Roles.MANAGER) {
      if (req.params.id !== id) {
        const findUser = await User.findById(req.params.id)

        if (
          findUser.role === Roles.ADMIN ||
          findUser.role === Roles.SUPER_ADMIN ||
          findUser.role === Roles.MANAGER
        ) {
          return res.status(403).json({
            message: 'Forbidden',
            status: Statuses.ERROR,
            code: 403,
          })
        }
      }
    }

    try {
      const existUser = await User.findById(req.params.id)

      if (!existUser || existUser.isDeleted) {
        return res.status(404).json({
          message: 'User not found',
          status: Statuses.ERROR,
          code: 404,
        })
      }

      await User.updateOne(
        { _id: req.params.id },
        { isDeleted: true },
        { new: true },
      )

      res.status(200).json({
        message: `Delete success user with id: ${req.params.id}`,
        status: Statuses.SUCCESS,
        code: 200,
      })
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },

  //----------------------------------------
  // POST /users/changePassword
  // User only can change password yourself
  changePassword: async (req, res) => {
    const { currentPassword, newPassword } = req.body
    const { id } = req.user

    try {
      const account = await Account.findOne({ user: id }).select('+password')

      // compare password with hashedPassword
      if (
        account &&
        (await bcrypt.compare(currentPassword, account.password))
      ) {
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        account.password = hashedPassword
        account.save()

        res.status(200).json({
          message: 'Change password success',
          status: Statuses.SUCCESS,
          code: 200,
        })
      } else {
        res.status(401).json({
          message: 'Current password is incorrect',
          status: Statuses.ERROR,
          code: 401,
        })
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message, status: Statuses.ERROR, code: 500 })
    }
  },
}

module.exports = UserController
