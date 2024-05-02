const express = require('express')
const router = express.Router()

const { getAllCategory, getCategory, addCategory, deleteCategory } = require('../Controllers/category')

router.get('/getCategory', getAllCategory)

router.get('/getCategory/:id', getCategory)

router.post('/addCategory/:name', addCategory)

router.delete('/:id/deleteCategory', deleteCategory)



module.exports = router