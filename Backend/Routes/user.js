const express = require('express')
const router = express.Router()
const { checkUserRole } = require('../Middleware/auth')
const { getUser, getAllUsers, addUser, editUser, deleteUser, addUserWithAddress } = require('../Controllers/user')


router.get('/getUsers', checkUserRole(['ADMIN']), getAllUsers);

router.get('/getUser/:id', getUser);

router.post('/addUser', checkUserRole(['ADMIN']), addUser);

router.post('/addUseWithAddress', checkUserRole(['ADMIN']), addUserWithAddress);


router.put('/editUser/:id', checkUserRole(['ADMIN', 'USER']), editUser);

router.delete('/deleteUser/:id', checkUserRole(['ADMIN']), deleteUser);


// router.post('/addProduct', upload.single('image'), addProduct)

// router.patch('/:id/updateProduct', upload.single('image'), updateProduct)

// router.delete('/:id/deleteProduct', deleteProduct)



module.exports = router