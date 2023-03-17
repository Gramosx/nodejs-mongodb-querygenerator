const express = require('express')
const api = express.Router()

const userController = require("../controllers/users/user.controller")

// Getting Users
api.get(
    '/users',
    userController.getAll
)

// Create User
api.post(
    '/users',
    userController.create
)

module.exports = api
