const express = require('express');
const shopController = require('../Controllers/shop');
const router=express.Router();

router.post('/post-item-cart', shopController.postItemCart);
router.get('/categories',shopController.getCategories);

router.get('/findcart_userId',shopController.getCartByUserId);



module.exports = router