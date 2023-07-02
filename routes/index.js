const authRouter = require('./auth.routes')

function routes(app) {
  app.use('/api/auth', authRouter)
}

module.exports = routes
