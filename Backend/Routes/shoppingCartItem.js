const express = require('express');

const { getAllShoppingCartItem, getShoppingCartItem, addShoppingCartItem, deleteShoppingCartItem, getItemFromShoppingCart, deleteShoppingCartItemByProduct } = require('../Controllers/ShoppingCartItem');
const router = express.Router()



router.get('/getAllShoppingCartItem', getAllShoppingCartItem);


router.get('/getItemFromShoppingCart/:user_id', getItemFromShoppingCart)

router.post('/addShoppingCartItem/:user_id/:product_id', addShoppingCartItem)

router.delete('/deleteShoppingCartItem/:shoppingcart_item_id', deleteShoppingCartItem)

router.delete('/deleteShoppingCartItemByProduct/:product_id', deleteShoppingCartItemByProduct)

module.exports = router