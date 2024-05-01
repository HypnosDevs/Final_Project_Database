const express = require('express')
const { getAllAdressFromUser, getAddress, addAddress, updateAddress, deleteAddress } = require('../Controllers/address')
const router = express.Router()


router.get('/getAllAdressFromUser', getAllAdressFromUser);

router.get('/getAddress', getAddress);

router.post('/addAddress', addAddress);

router.put('/updateAddress', updateAddress);

router.post('/deleteAddress', deleteAddress);




module.exports = router