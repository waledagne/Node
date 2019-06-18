const Product = require('../models/product');

exports.getAddProduct = (req,res,next)=>{
    res.render('admin/add-product',{
        pageTitle:'Add Prodcut',
        path:'/admin/add-product',
        formsCSS:true,
        productCSS:true,
        activeProductCSS:true
});
}
 exports.postAddProduct = (req,res,next)=>{
const product = new Product(req.body.title);
  product.save ();
     res.redirect('/'); 
   }

   exports.getProdcuts =(req, res, next)=>{
       Product.fetchAll(products=>{
        res.render('admin/products',{
            prod:products,
            pageTitle:' Admin products',
            path:'/admin/products'
        })
       });

   }