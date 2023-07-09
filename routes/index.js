const authRouter = require('./auth.routes')
const categoryRouter = require('./category.routes')
const bookRouter = require('./book.routes')
const userRouter = require('./user.routes')

function routes(app) {
  app.use('/api/auth', authRouter)
  app.use('/api/books', bookRouter)
  app.use('/api/categories', categoryRouter)
  app.use('/api/users', userRouter)
}

module.exports = routes
