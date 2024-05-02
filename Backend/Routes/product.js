const express = require('express')
const router = express.Router()

const { getAllProduct, getProduct, addProduct, updateProduct, deleteProduct } = require('../Controllers/product')
const upload = require('../Middleware/upload')

router.get('/getProduct', getAllProduct)

router.get('/getProduct/:id', getProduct)

router.post('/addProduct', upload.single('image'), addProduct)

router.patch('/:id/updateProduct', upload.single('image'), updateProduct)

router.delete('/:id/deleteProduct', deleteProduct)



module.exports = router