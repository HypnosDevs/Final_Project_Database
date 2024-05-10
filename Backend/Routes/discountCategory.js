const express = require('express')
const router = express.Router()

const { getAllDiscountCategory, addDiscountCategory, deleteDiscountCategory } = require('../Controllers/discountCategory')

router.get('/getDiscountCategory', getAllDiscountCategory);

router.post('/addDiscountCategory', addDiscountCategory);

router.delete('/:id/deleteDiscountCategory', deleteDiscountCategory);


module.exports = router