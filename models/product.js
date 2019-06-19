const fs = require('fs');
const path = require('path'); 
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
     constructor(title, imageUrl, description){
         this.title =title;
         this.imageUrl =imageUrl;
         this.description = description;
     }
     save(){
         getProductFromFile(products =>{
            products.push(this);
            fs.writeFile(p,JSON.stringify(products),(err)=>{
                if(err){
                    console.log(err);
                }
            });
         });
     }
     static fetchAll(cb){
        getProductFromFile(cb);
     }
 }  