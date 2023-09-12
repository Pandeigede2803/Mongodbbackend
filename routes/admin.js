const express = require('express');
const prodController = require('../Controllers/product');
const router = express.Router();
const {body} = require('express-validator');
const userController = require('../Controllers/user')


router.post('/add-user',userController.createUser);
router.get('/get-user',userController.getAllUsers);



//KLASIFIKASIKAN VALIDASI DATA

router.post('/add-product',[
    //TITLE HARUS TRIM DAN IS LENGTH MINIMAL 3
    body('title').trim().isLength({min:3}),
    //PRICE HARUS TRIM DAN IS LENGTH MINIMAL 3
    body('price').trim().isLength({min:3}),
    //PRICE HARUS INTERGER
    body('price').isInt(),
],prodController.postAddProduct)

// router.post("/add-product", prodController.postAddProduct);
router.get("/get-product", prodController.getProducts);

router.get("/get-product-filter-price", prodController.getProductsByPrice);
router.get("/get-product-filter-category", prodController.getProductsByCategory);
router.get("/get-product-filter-color", prodController.getProductsByColor);

module.exports = router;