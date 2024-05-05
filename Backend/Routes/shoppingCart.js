const express = require('express');
const { getAllShoppingcart, getAllShoppingcartFromuser, getShoppingCart, addShoppingCart, deleteShoppingCart } = require('../Controllers/shoppingCart');
const router = express.Router()

router.get('/getAllShoppingcart', getAllShoppingcart);

router.get('/getAllShoppingcartFromuser', getAllShoppingcartFromuser);

router.get('/getShoppingCart/:shoppingcart_id', getShoppingCart)

router.post('/addShoppingCart/:id', addShoppingCart)

router.delete('/deleteShoppingCart/:shoppingcart_id', deleteShoppingCart)

module.exports = router