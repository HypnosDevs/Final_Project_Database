const express = require('express')
const { getAllAddressFromUser, getAddress, addAddress, updateAddress, deleteAddress } = require('../Controllers/address')
const router = express.Router()


router.get('/getAllAddressFromUser/:user_id', getAllAddressFromUser);

router.get('/getAddress/:id', getAddress);

router.post('/addAddress/:user_id', addAddress);

router.put('/updateAddress/:id', updateAddress);

router.post('/deleteAddress/:id', deleteAddress);




module.exports = router