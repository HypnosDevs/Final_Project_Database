const express = require('express');
const { getAllOrderItem, getOrderItem, addOrderItem, deleteOrderItem, getProductFromOrderItem } = require('../Controllers/orderItem');
const router = express.Router()

router.get('/getAllOrderItem', getAllOrderItem);

router.get('/getOrderItem/:order_id/:product_id', getOrderItem)

router.get('/getProductFromOrderItem/:order_id/:product_id', getProductFromOrderItem)


router.post('/addOrderItem/:order_id/:product_id', addOrderItem)

router.delete('/deleteOrderItem/:order_id/:product_id', deleteOrderItem)

module.exports = router