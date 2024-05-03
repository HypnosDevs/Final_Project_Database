const express = require('express')
const router = express.Router()

const { register, login, logout, checkMatch } = require('../Controllers/auth')

router.post('/register', register)

router.post('/login', login)

router.post('/logout', logout)

router.post('/checkMatch', checkMatch)


module.exports = router