const Product = require('../models/product')

   exports.getProducts = (req,res,next)=> { 
    Product.fetchAll(products=>{
      res.render('shop/product_list',{
        prod:products,
        pageTitle:'Shop',
        path:'/products'
    });
      }
    )};
   
    exports.getIndex = (req, res, next) =>{
      Product.fetchAll(products=>{
        res.render('shop/index',{
           prod: products,
           pageTitle:'shop',
           path:'/',
        });
      })
    }


    exports.getCart = (req, res, next)=>{
      res.render('shop/cart',{
        path:'/cart',
        pageTitle: 'Your Cart'
      });
    }

    exports.getOrders = (req, res, next)=>{
      res.render('shop/orders',{
        path:'/orders',
        pageTitle: 'Orders'
      });
    }

    exports.getCheckout = (req, res, next)=>{
      res.render('shop/checkout',{
        path:'/checkout',
        pageTitle:'Checkout Form'
      });
    }