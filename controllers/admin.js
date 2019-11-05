const mongodb = require('mongodb');
const {validationResult} = require('express-validator/check');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    errorMessage:null,
    hasError:false,
    //isAuthenticated: req.session.isLoggedIn
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
 const errors = validationResult(req);
 if(!errors.isEmpty()){
   return res.status.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/edit-product',
    editing: false,
    hasError:true,
    product: {title:title,imageUrl:imageUrl,price:price,description:description},
    errorMessage:errors.array()[0].msg
   // isAuthenticated: req.session.isLoggedIn
  });
 }
 const product = new Product({title:title,price:price,description:description,imageUrl:imageUrl,userId:req.user});
 product
  .save()
  .then(result=>{
    console.log('products created');
    res.redirect('/admin/products');
  })
  .catch(err=>{
    console.log(err);
  })
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    // Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        hasError:false,
        product: product,
        errorMessage:null
        //isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  
 Product.findById(prodId)
        .then(product=>{
        if(product.userId.toString() !== req.user._id.toString()){
          return res.redirect('/')
        }
          product.title = updatedTitle;
          product.price = updatedPrice;
          product.imageUrl = updatedImageUrl;
          product.description = updatedDesc;
          return product.save()
          .then(result =>{
            console.log("Updated Product");
            res.redirect('/admin/products');
          })
        })
  .catch(err=>{
    console.log(err);
  });
}

exports.getProducts = (req, res, next) => {
  Product.find({userId:req.user._id})
  .then(products => {
    console.log(products);
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      isAuthenticated: req.session.isLoggedIn
    })
  })
  .catch(err=>{
    console.log(err);
  });

};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({_id:prodId,userId:req.user._id})
  .then(()=>{
    console.log("Product Deleted");
    res.redirect('/admin/products');
  })
  .catch(err=>{
    console.log(err);
  })

};
 