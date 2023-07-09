const authRouter = require('./auth.routes')
const userRouter = require('./user.routes')
const categoryRouter = require('./category.routes')

function routes(app) {
  app.use('/api/auth', authRouter)
  app.use('/api/users', userRouter)
  app.use('/api/categories', categoryRouter)
}

module.exports = routes
