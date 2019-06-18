const express = require('express');
const path = require('path');
const adminController =require('../controllers/admin');
//const adminProductsController = require('../controllers/admin/products')
const router=express.Router();
 

router.get('/add-product',adminController.getAddProduct);
router.get('/products',adminController.getProdcuts );
router.post('/add-product',adminController.postAddProduct);
 
    module.exports =router; 