const express = require('express')
const router = express.Router()

router.get('/getAllsOrderItem/', getAllsOrderItem);

router.get('/getOrderItem/:order_id/:product_id', getOrderItem)

router.post('/addOrderItem/:order_id/:product_id', addOrderItem)

router.delete('/deleteOrderItem/:order_id/:product_id', deleteProduct)

module.exports = router