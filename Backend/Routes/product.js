const express = require('express')
const router = express.Router()

const { getAllProduct, getProduct, addProduct, updateProduct, deleteProduct, upload } = require('../Controllers/product')


router.get('/Product/getProduct', getAllProduct)

router.get('/Product/getProduct/:id', getProduct)

router.post('/Product/addProduct', upload.single('image'), addProduct)

router.patch('/Product/:id/updateProduct', upload.single('image'), updateProduct)

router.delete('/Product/:id/deleteProduct', deleteProduct)



module.exports = router