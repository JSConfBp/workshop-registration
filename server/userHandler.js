const moment = require('moment')
const store = require('./store')
const getUserData = require('./getUserData')
const getSeats = require('./getSeats')

const isWorkshopFull = (workshop) => {
	return (workshop.seats - workshop.taken) < 1
}

module.exports.get = async (req, res) => {
	let {
		token
	} = req.cookies

	if (!token) {
		token = req.headers.authorization.replace('Bearer ', '')
	}

	if (!token) {
		res.sendStatus(403)
		return
	}

	try {
		const data = await getUserData(token)
		res.send(Object.assign({}, {
			workshop: data.workshop,
			id: data.id,
			updatedAt: data.updated_at,
			ticketId: data.ticketId
		}))
	} catch (e) {
		res.sendStatus(403)
	}
}

module.exports.post = async (req, res) => {
	let {
		token
	} = req.cookies

	if (!token) {
		token = req.headers.authorization.replace('Bearer ', '')
	}

	if (!token) {
		res.sendStatus(403)
		return
	}

	try {
		const data = await getUserData(token)
		const { routeCache } = req.app
		const { workshop } = req.body
		const { id } = data

		if (!workshop) {
			throw new Error('Missing workshop ID')
		}

		const seats = await getSeats()

		if (isWorkshopFull(seats[workshop])) {
			res.status(409)
			res.send("Workshop is full, sorry, pick another one.")
		}

		const saveData = Object.assign({}, data, {
			updated_at: moment().unix(),
			workshop
		})

		await store.hset('users', id, JSON.stringify(saveData))
		routeCache.removeCache('/api/seats');

		res.send('')
	} catch (e) {
		console.error(e);

		res.status(403)
		res.send(e.message)
	}
}


module.exports.delete = async (req, res) => {
	let {
		token
	} = req.cookies

	if (!token) {
		token = req.headers.authorization.replace('Bearer ', '')
	}

	if (!token) {
		res.sendStatus(403)
		return
	}

	try {
		const data = await getUserData(token)
		const { routeCache } = req.app
		const { id } = data

		const saveData = Object.assign({}, data, {
			updated_at: moment().unix(),
			workshop: ''
		})

		await store.hset('users', id, JSON.stringify(saveData))
		routeCache.removeCache('/api/seats');

		res.send('')
	} catch (e) {
		console.error(e);

		res.status(403)
		res.send(e.message)
	}
}