const express = require('express');
const { addOrder, getAllOrders, getOrder, getOrderFromUser, deleteOrder } = require('../Controllers/order');
const router = express.Router()

router.get('/getAllOrders', getAllOrders);

router.get('/getOrder/:order_id', getOrder)

router.get('/getOrderFromUser/:user_id', getOrderFromUser)

router.post('/addOrder/:payment_id/:user_id', addOrder)

router.delete('/deleteOrder/:order_id', deleteOrder)

module.exports = router