const express = require('express')
const router = express.Router()
const { checkUserRole } = require('../Middleware/auth')
const { getUser, getAllUsers, addUser, editUser, deleteUser, addUserWithAddress, getAllUsernameAndEmail, addOrder } = require('../Controllers/user')


router.get('/getUsers', getAllUsers);

router.get('/getUser/:id', getUser);

router.get('/getAllUsernameEmail', getAllUsernameAndEmail);

router.post('/addUser', checkUserRole(['ADMIN']), addUser);

router.post('/addUseWithAddress', checkUserRole(['ADMIN']), addUserWithAddress);


router.put('/editUser/:id', checkUserRole(['ADMIN', 'USER']), editUser);

router.delete('/deleteUser/:id', checkUserRole(['ADMIN']), deleteUser);

router.post('/addOrder', checkUserRole(['ADMIN', 'USER']), addOrder);
// router.post('/addProduct', upload.single('image'), addProduct)

// router.patch('/:id/updateProduct', upload.single('image'), updateProduct)

// router.delete('/:id/deleteProduct', deleteProduct)



module.exports = router