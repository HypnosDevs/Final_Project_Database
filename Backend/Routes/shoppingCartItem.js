const express = require('express');
const { getAllShoppingCartItem, getShoppingCartItem, addShoppingCartItem, deleteShoppingCartItem, getProductFromShoppingCartItem } = require('../Controllers/shoppingCartItem');
const router = express.Router()

router.get('/getAllShoppingCartItem', getAllShoppingCartItem);

router.get('/getShoppingCartItem/:ShoppingCart_id/:product_id', getShoppingCartItem)

router.get('/getProductFromShoppingCartItem/:ShoppingCart_id/:product_id', getProductFromShoppingCartItem)

router.post('/addShoppingCartItem/:ShoppingCart_id/:product_id', addShoppingCartItem)

router.delete('/deleteShoppingCartItem/:ShoppingCart_id/:product_id', deleteShoppingCartItem)

module.exports = router