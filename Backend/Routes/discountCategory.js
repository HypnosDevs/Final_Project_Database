const express = require('express')
const router = express.Router()

const { getAllDiscountCategory, getDiscountCategory, getDiscountCategoryByDiscountId, addDiscountCategory, deleteDiscountCategoryByDiscountId, deleteDiscountCategory } = require('../Controllers/discountCategory')

router.get('/getDiscountCategory', getAllDiscountCategory);

router.get('/getDiscountCategory/:id', getDiscountCategory);

router.get('/getDiscountCategoryByDiscountId/:id', getDiscountCategoryByDiscountId);

router.post('/addDiscountCategory', addDiscountCategory);

router.delete('/:id/deleteDiscountCategoryByDiscountId', deleteDiscountCategoryByDiscountId);


module.exports = router