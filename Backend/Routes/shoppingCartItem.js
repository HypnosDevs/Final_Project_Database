const express = require('express');

const { getAllShoppingCartItem, getShoppingCartItem, addShoppingCartItem, deleteShoppingCartItem, getItemFromShoppingCart } = require('../Controllers/ShoppingCartItem');
const router = express.Router()



router.get('/getAllShoppingCartItem', getAllShoppingCartItem);

router.get('/getShoppingCartItem/:shoppingcart_id/:product_id', getShoppingCartItem)

router.get('/getItemFromShoppingCart/:shoppingcart_id', getItemFromShoppingCart)

router.post('/addShoppingCartItem/:shoppingcart_id/:product_id', addShoppingCartItem)

router.delete('/deleteShoppingCartItem/:shoppingcart_item_id', deleteShoppingCartItem)

module.exports = router