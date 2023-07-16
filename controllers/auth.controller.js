const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const Account = require('../models/account.model')
const { Statuses } = require('../common/constants/constants')

const authController = {
  // POST /api/auth/signUp
  // access: public
  signUp: async (req, res) => {
    const { username, password } = req.body

    if (!username) {
      return res.status(400).json({
        message: 'Username is required.',
        status: Statuses.ERROR,
        code: 400,
      })
    }

    if (!password) {
      return res.status(400).json({
        message: 'Password is required.',
        status: Statuses.ERROR,
        code: 400,
      })
    }

    const accountExists = await Account.findOne({ username })

    if (accountExists) {
      return res.status(400).json({
        message: 'Username already exists.',
        status: Statuses.ERROR,
        code: 400,
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({ name: username })

    const newAccount = await Account.create({
      username,
      password: hashedPassword,
      user: newUser.id,
    })

    await User.findByIdAndUpdate(newUser.id, { account: newAccount.id })

    if (newAccount) {
      return res.status(201).json({
        id: newAccount.id,
        username: newAccount.username,
        name: newUser.name,
      })
    }

    return res.status(400).json({
      message: 'User data is not valid',
      status: Statuses.ERROR,
      code: 400,
    })
  },

  // POST /api/auth/signIn
  // access: public
  signIn: async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password is required.',
        status: Statuses.ERROR,
        code: 400,
      })
    }

    const account = await Account.findOne({ username }).select('+password')

    // compare password with hashedPassword
    if (account && (await bcrypt.compare(password, account.password))) {
      const user = await User.findOne({ _id: account.user })

      if (!user || user.isDeleted) {
        return res.status(404).json({
          message: 'User not found',
          status: Statuses.ERROR,
          code: 404,
        })
      }

      const accessToken = jwt.sign(
        {
          user: {
            id: user.id,
            username: account.username,
            name: user.name,
            role: user.role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }, // 1 day
      )

      return res.status(200).json({
        userId: user.id,
        role: user.role,
        token: { value: accessToken, type: 'Bearer' },
      })
    } else {
      return res.status(401).json({
        message: 'Invalid username or password',
        status: Statuses.ERROR,
        code: 401,
      })
    }
  },

  // POST /api/auth/whoami
  // access: private
  whoAmI: async (req, res) => {
    return res.status(200).json(req.user)
  },
}

module.exports = authController
