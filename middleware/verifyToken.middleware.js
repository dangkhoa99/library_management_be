const jwt = require('jsonwebtoken')
const { Statuses } = require('../common/constants/constants')

const verifyToken = async (req, res, next) => {
  const authorization = req.headers.Authorization || req.headers.authorization

  if (!authorization) {
    return res.status(400).json({
      message: 'missing authorization header',
      status: Statuses.ERROR,
      code: 400,
    })
  }

  if (authorization && authorization.startsWith('Bearer')) {
    const token = authorization.split(' ')[1]

    try {
      const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

      req.user = verified.user

      next()
    } catch (err) {
      res
        .status(401)
        .json({ message: err.message, status: Statuses.ERROR, code: 401 })
    }
  } else {
    return res.status(400).json({
      message: 'invalid jwt type',
      status: Statuses.ERROR,
      code: 400,
    })
  }
}

module.exports = verifyToken
