const express = require('express');
const { addOrder, getAllOrders, getOrder, deleteOrder } = require('../Controllers/order');
const router = express.Router()

router.get('/getAllOrders', getAllOrders);

router.get('/getOrder/:order_id', getOrder)

router.post('/addOrder/:payment_id/:user_id', addOrder)

router.delete('/deleteOrderItem/:order_id', deleteOrder)

module.exports = router