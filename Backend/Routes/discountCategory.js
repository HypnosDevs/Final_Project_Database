const express = require('express')
const router = express.Router()

const { getAllDiscountCategory, getDiscountCategory, getDiscountCategoryByDiscountId, addDiscountCategory, deleteDiscountCategoryByDiscountId, deleteDiscountCategory, deleteDiscountCategoryByCategoryId, deleteDiscountCategoryById, getDiscountCategoryByDiscountCategoryID } = require('../Controllers/discountCategory')

router.get('/getDiscountCategory', getAllDiscountCategory);

router.get('/getDiscountCategory/:id', getDiscountCategory);

router.get('/getDiscountCategoryByDiscountId/:id', getDiscountCategoryByDiscountId);

router.get('/getDiscountCategoryByDiscountCategoryID/:discount_id/:category_id', getDiscountCategoryByDiscountCategoryID);


router.post('/addDiscountCategory', addDiscountCategory);

router.delete('/deleteDiscountCategoryByDiscountId/:discount_id', deleteDiscountCategoryByDiscountId);

router.delete('/deleteDiscountCategoryByCategoryId/:category_id', deleteDiscountCategoryByCategoryId);

router.delete('/deleteDiscountCategoryById/:discount_id/:category_id', deleteDiscountCategoryById);


module.exports = router