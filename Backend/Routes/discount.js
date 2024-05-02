const express = require('express')
const router = express.Router()

const { getAllDiscount, getDiscount, addDiscount, deleteDiscount, updateDiscount } = require('../Controllers/discount')

router.get('/getDiscount', getAllDiscount)

router.get('/getDiscount/:id', getDiscount)

router.post('/addDiscount', addDiscount)

router.post('/:id/updateDiscount', updateDiscount)

router.delete('/:id/deleteDiscount', deleteDiscount)



module.exports = router