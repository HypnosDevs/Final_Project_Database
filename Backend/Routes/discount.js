const express = require('express')
const router = express.Router()

const { getAllDiscount, getDiscount, addDiscount, deleteDiscount, updateDiscount } = require('../Controllers/discount')

router.get('/getDiscount', getAllDiscount)

router.get('/getDiscount/:id', getDiscount)

router.post('/addDiscount', addDiscount)

router.put('/updateDiscount/:id', updateDiscount)

router.delete('/deleteDiscount/:id', deleteDiscount)



module.exports = router