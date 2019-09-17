const store = require('./store')
const csv = require('csv')

const VALID_TOKEN = process.env.ADMINTOKEN

module.exports.get = async (req, res) => {
	let {
		adminToken
	} = req.headers


	if (!adminToken || adminToken !== VALID_TOKEN) {
		res.sendStatus(403)
		return
	}

	try {
		const data = await store.hgetall('users')

		const result = Object.values(data)
			.map(str => JSON.parse(str))
			.map(({ticketId, workshop, updated_at}) => ({ticketId, workshop, updated_at}))

		if (req.headers['content-type'] && req.headers['content-type'] === 'text/csv') {
			csv.stringify(
				result,
				{
					header: true
				},
				(err, csvResult) => {
					if (err) {
						console.error(err);
						return res.sendStatus(500)
					}

					res.send(csvResult)
				}
			)
		} else {
			res.send(result)
		}


	} catch (e) {
		console.error(e);
		res.sendStatus(403)
	}
}