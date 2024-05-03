const express = require('express')
const router = express.Router()

const { register, login, logout, checkMatch, currentUser, checkUsername } = require('../Controllers/auth')

router.post('/register', register);

router.post('/login', login);

router.get('/currentUser', currentUser);

router.post('/logout', logout);

router.post('/checkMatch', checkMatch);

router.post('/checkUsername', checkUsername);


module.exports = router