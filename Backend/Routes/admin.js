const express = require('express');
const { addUser, adminRegister } = require('../Controllers/admin');
const router = express.Router()



// router.post('/addUser', addUser);

router.post('/addUser', addUser);

router.post('/adminRegister', adminRegister);





module.exports = router