const getUserData = require('./getUserData')

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
		res.send(data)
	} catch (e) {
		res.sendStatus(403)
	}
}

module.exports.post = async (req, res) => {}