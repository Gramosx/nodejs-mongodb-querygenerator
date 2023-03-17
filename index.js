require('dotenv').config()
const mongoose = require('mongoose')
const app = require('./app')
mongoose.set('strictQuery', true) // TODO: Supressing the console warning

console.log(process.env.DB_URL)
mongoose
    .connect(process.env.DB_URL, { useNewUrlParser: true })
    .catch((error) => console.log(error))

mongoose.connection.on('connected', () => {
    console.log('Mongoose default connection is open to ', process.env.DB_URL)
})
mongoose.connection.on('error', (err) =>
    console.log('Mongoose default connection has occured ' + err + ' error')
)
mongoose.connection.on('reconnected', () => {
    console.log('Mongoose successfully reconnected')
})

mongoose.connection.on('disconnected', () =>
    console.log('Mongoose default connection is disconnected')
)
process.on('SIGINT', () => mongoose.connection.close(() => process.exit()))

app.listen(process.env.PORT, () =>
    console.log(`server started on Port: ${process.env.PORT}`)
)

module.exports = app
