const express = require('express')
const router = express.Router()

const { getAllCategory, getAllCategoryFromProduct, getCategory, getCategoryFromDiscountCategoryId, addCategory, deleteCategory, deleteProductCategory } = require('../Controllers/category')

router.get('/getCategory', getAllCategory)

router.get('/getAllCategoryFromProduct/:id', getAllCategoryFromProduct)

router.get('/getCategory/:id', getCategory)

router.get('/getCategoryFromDiscountCategoryId/:discount_category_id', getCategoryFromDiscountCategoryId)

router.post('/addCategory/:name', addCategory)

router.delete('/deleteCategory/:id', deleteCategory)

router.delete('/deleteProductCategory/:id', deleteProductCategory)


module.exports = router