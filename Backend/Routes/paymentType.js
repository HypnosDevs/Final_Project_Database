const express = require('express')
const router = express.Router()

const { getAllPaymentType, getPaymentType, addPaymentType, deletePaymentType, getPaymentTypeFromUserPaymentMethod } = require('../Controllers/paymentType')

router.get('/getPaymentType', getAllPaymentType)

router.get('/getPaymentType/:id', getPaymentType)

router.get('/getPaymentTypeFromUserPaymentMethod/:payment_method_id', getPaymentTypeFromUserPaymentMethod)

router.post('/addPaymentType', addPaymentType)

router.delete('/:id/deletePaymentType', deletePaymentType)



module.exports = router