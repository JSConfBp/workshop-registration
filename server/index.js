const next = require('next')
const express = require('express')
const cookieParser = require('cookie-parser')
const router = require('./router')
const errorHandler = require('./errorHandler')
const loginHandler = require('./loginHandler')
const userHandler = require('./userHandler')

const dev = process.env.NODE_ENV !== 'production'

module.exports = function (getRoutes, config) {
	const app = next({ dev, conf: config })
	const handle = app.getRequestHandler()
	const nextConfig = app.nextConfig

	const initNext = (app) => {
		return app
			.prepare()
			.then((...args) => {
				const server = express()
				server.use(cookieParser())
				server.nextConfig = app.nextConfig

				return server
			})
	}

	const attachRoutes = (server) => {
		server.use('/api/*', express.json())
		server.post('/api/login', loginHandler)
		server.get('/api/user', userHandler.get)
		server.post('/api/user', userHandler.post)

		return server
	}

	const attachNextRoutes = (server) => {
		const routes = router(app, getRoutes)

		server.use('/', routes)
		server.get('*', (req, res) => handle(req, res))

		return server
	}

	const startServer = (server) => {
		const { port } = config

		server.listen(port, (err) => {
			if (err) throw err
			console.log(`> Ready on http://0.0.0.0:${port}`)
		})
	}

	return Promise.resolve(app)
		.then(initNext)
		.then(attachRoutes)
		.then(attachNextRoutes)
		.then(startServer)
		.catch(errorHandler)
}
