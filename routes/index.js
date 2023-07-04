const authRouter = require('./auth.routes')
const categoryRouter = require('./category.routes')

function routes(app) {
  app.use('/api/auth', authRouter)
  app.use('/api/categories', categoryRouter)
}

module.exports = routes
