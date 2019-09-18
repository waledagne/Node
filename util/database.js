const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

 let db;
const mongoConnect = callback =>{
     MongoClient.connect("mongodb://localhost:27017/products?retryWrites=true")
     .then(client => {
          console.log("connected");
          db =client.db();
          callback(client);
          
     })
     .catch (err => {
          console.log(err);
          throw err;
     });
};
     const getDb = () =>{
      if(db){
           return db;
      }
      throw 'No database found!';
     }

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;