const express = require('express');
const { addUser } = require('../Controllers/admin');
const router = express.Router()



router.post('/addUser', addUser);





module.exports = router