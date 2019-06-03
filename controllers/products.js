const products =[];

exports.getAddProduct = (req,res,next)=>{
    res.render('add-product',{
        pageTitle:'Add Prodcut',
        path:'/admin/add-product',
        formsCSS:true,
        productCSS:true,
        activeProductCSS:true
});
}
 exports.postAddProduct = (req,res,next)=>{
    products.push({title:req.body.title});
     res.redirect('/'); 
   }

   exports.getProducts = (req,res,next)=>{
    res.render('shop',{
        prod:products,
        pageTitle:'Shop',
        path:'/'
    });
      }