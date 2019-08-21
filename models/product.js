const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');
class Product {
  constructor(title, price, description, imageUrl,_id,userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id =  _id ? new mongodb.ObjectId(_id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if(this._id){
        dbOp = db
        .collection('products')
        .updateOne({_id: this._id}, {$set: this});
    }
    else{
      dbOp = db
      .collection('products')
      .insertOne(this);
    }
    return dbOp 
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }
  static fetchAll(){
      const db = getDb();
      return db
      .collection('products')
      .find()
      .toArray()
      .then(products=>{
          console.log(products);
          return products;
      })
      .catch(err=>{
          console.log(err);
      });
  }
  static findById(prodId){
      const db = getDb();
      return db
      .collection('products')
      .find({_id: new mongodb.ObjectId(prodId)})
      .next()
      .then(product=>{
          console.log(product);
          return product;
      })
      .catch(err=>{
          console.log(err);
      });
  }
  static deleteById(prodId){
      const db = getDb();
      return db
      .collection('products')
      .deleteOne({_id: new mongodb.ObjectId(prodId)})
      .then(results=>{
          console.log('Deleted');
      })
      .catch(err=>{
          console.log(err);
      });
  }
}

module.exports = Product;
/* const fs = require('fs');
const path = require('path'); 
const Cart =require('./cart');
const p = path.join(path.dirname(process.mainModule.filename),'data','products.json');


const getProductFromFile = cb =>{
    fs.readFile(p,(err,filecontent)=>{
        if(err){
            cb([]);
        }else{
       cb(JSON.parse(filecontent));
        }
    });
};
 module.exports =class Product{
     constructor(id,title, imageUrl,price, description){
         this.id = id;
         this.title =title;
         this.imageUrl =imageUrl;
         this.price = price;
         this.description = description;
        
     }
     save(){
         
       
         getProductFromFile(products =>{
            if(this.id){
             const existingProductIndex= products.findIndex(prod => prod.id===this.id);
             const updatedProducts =[...products];
             updatedProducts[existingProductIndex]=this;
             fs.writeFile(p,JSON.stringify(updatedProducts),(err)=>{
                if(err){
                    console.log(err);
                  }
               });
            }
            else{
                this.id =Math.random().toString();
                products.push(this);
                fs.writeFile(p,JSON.stringify(products),(err)=>{
                    if(err){
                        console.log(err);
                    }
                });
                }
         });
        
     }

     static deleteById(id) {
        getProductFromFile(products=>{
            const product = products.find(prod=>prod.id === id);
            const updatedProducts = products.filter(prod => prod.id !== id);
           fs.writeFile(p,JSON.stringify(updatedProducts),err =>{
               if(!err){
                Cart.deleteProduct(id,product.price);
               }
           });
        });
     }
     
     static fetchAll(cb){
        getProductFromFile(cb);
     }

     static findById(id,cb){
         getProductFromFile(products=>{
             const product = products.find(p => p.id=== id);
             cb(product);
         });
     };
 } ;

  */