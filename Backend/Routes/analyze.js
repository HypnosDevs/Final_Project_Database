const express = require('express');
const { bestCategory, bestCategoryFromUser, getUserTotalSpending, getProductSold, getBestProvince, getTotalSpending } = require('../Controllers/analyze');
const router = express.Router()


router.get('/bestCategory', bestCategory);

router.get('/bestCategoryFromUser/:user_id', bestCategoryFromUser);

router.get('/getUserTotalSpending/:user_id', getUserTotalSpending);

router.get('/getProductSold', getProductSold);

router.get('/getBestProvince', getBestProvince);

router.get('/getTotalSpending', getTotalSpending);


module.exports = router