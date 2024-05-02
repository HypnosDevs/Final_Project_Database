const express = require('express');
const { getAllShoppingcartFromuser, getShoppingCart, addShoppingCart, deleteShoppingCart } = require('../Controllers/shoppingCart');
const router = express.Router()

router.get('/getAllShoppingcartFromuser', getAllShoppingcartFromuser);

router.get('/getShoppingCart/:shoppingcart_id', getShoppingCart)

router.post('/addShoppingCart', addShoppingCart)

router.delete('/deleteShoppingCart', deleteShoppingCart)

module.exports = router