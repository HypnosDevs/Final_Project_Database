const express = require('express')
const router = express.Router()

const { register, getUsers, login, checkUserRole } = require('../Controllers/auth')


router.post('/register', register)

router.post('/login', login)

router.get('/getUsers', checkUserRole(['ADMIN']), getUsers)


module.exports = router