const moment = require('moment')
const store = require('./store')
const tokenAuth = require('./token')

module.exports = async (token) => {
	const payload = await tokenAuth.decode(token)
	const id = payload.sub
	const data = await store.get(id);

	const {
		ticketId,
		updated_at,
		workshop,
		created_at
	} = data

	data.updated_at = moment().unix()
	store.set(id, data);

	return {
		ticketId,
		updated_at,
		workshop,
		created_at
	};
}