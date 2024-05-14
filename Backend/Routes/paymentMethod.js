const express = require('express')
const router = express.Router()

const { getAllPaymentMethod, getAllPaymentMethodFromUser, getPaymentMethod, addPaymentMethod, updatePaymentMethod, deletePaymentMethod } = require('../Controllers/paymentMethod')

router.get('/getPaymentMethod', getAllPaymentMethod)

router.get('/getAllPaymentMethodFromUser/:id', getAllPaymentMethodFromUser);

router.get('/getPaymentMethod/:id', getPaymentMethod)

router.post('/addPaymentMethod/:id', addPaymentMethod)

router.patch('/:id/updatePaymentMethod', updatePaymentMethod)

router.delete('/:id/deletePaymentMethod', deletePaymentMethod)



module.exports = router