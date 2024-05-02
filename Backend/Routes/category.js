const express = require('express')
const router = express.Router()

const { getAllCategory, getAllCategoryFromProduct, getCategory, addCategory, deleteCategory } = require('../Controllers/category')

router.get('/getCategory', getAllCategory)

router.get('/getAllCategoryFromProduct/:id', getAllCategoryFromProduct)

router.get('/getCategory/:id', getCategory)

router.post('/addCategory/:name', addCategory)

router.delete('/:id/deleteCategory', deleteCategory)



module.exports = router