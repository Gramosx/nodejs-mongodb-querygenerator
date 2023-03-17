require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const userApi = require("./routes/users")

const app = express()

// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
)
app.use(bodyParser.json())

app.use('/api', userApi)

module.exports = app
