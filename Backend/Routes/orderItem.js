const express = require('express');
const { getAllOrderItem, getOrderItem, addOrderItem, deleteOrderItem, deleteOrderItemByOrderItemId, getOrderItemFromOrder, getProductFromOrderItem } = require('../Controllers/orderItem');
const router = express.Router()

router.get('/getAllOrderItem', getAllOrderItem);

router.get('/getOrderItem/:order_id/:product_id', getOrderItem)

router.get('/getOrderItemFromOrder/:order_id', getOrderItemFromOrder)

router.get('/getProductFromOrderItem/:order_id/:product_id', getProductFromOrderItem)

router.post('/addOrderItem/:order_id/:product_id', addOrderItem)

router.delete('/deleteOrderItem/:order_id/:product_id', deleteOrderItem)

router.delete('/deleteOrderItemByOrderItemId/:order_item_id', deleteOrderItemByOrderItemId)

module.exports = router