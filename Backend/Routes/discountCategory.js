const express = require('express')
const router = express.Router()

const { getAllDiscountCategory, getDiscountCategory, addDiscountCategory, deleteDiscountCategory } = require('../Controllers/discountCategory')

router.get('/getDiscountCategory', getAllDiscountCategory);

router.get('/getDiscountCategory/:id', getDiscountCategory);

router.post('/addDiscountCategory', addDiscountCategory);

router.delete('/:id/deleteDiscountCategory', deleteDiscountCategory);


module.exports = router