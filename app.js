const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const cors = require('cors')

const PORT = config.get('PORT')
const app = express()

app.use(cors())
app.use(express.json({ extended: true }))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link', require('./routes/link.routes'))

const start = async () => {
	try {
		await mongoose.connect(config.get('MONGO_URI'), {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		})

		app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
	} catch (e) {
		console.log(e)
	}
}

start()