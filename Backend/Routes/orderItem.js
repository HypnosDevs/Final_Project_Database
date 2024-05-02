const express = require('express');
const { getAllOrderItem, getOrderItem, addOrderItem, deleteOrderItem } = require('../Controllers/orderItem');
const router = express.Router()

router.get('/getAllsOrderItem', getAllOrderItem);

router.get('/getOrderItem/:order_id/:product_id', getOrderItem)

router.post('/addOrderItem/:order_id/:product_id', addOrderItem)

router.delete('/deleteOrderItem/:order_id/:product_id', deleteOrderItem)

module.exports = router