const express =   require('express'); 
const path = require('path');
const bodyParser= require('body-parser');
const session = require('express-session');
const get404Controller = require('./controllers/404');
const mongoose = require('mongoose');
const mongoSession = require('connect-mongodb-session')(session );
const User = require('./models/user');

const adminRoutes= require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const MONOGDB_URI = "mongodb://localhost:27017/shop?retryWrites=true";
const app= express(); 
app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

const store = new mongoSession({
    uri:  MONOGDB_URI,
    collection: 'sessions'
})
app.use(session({secret:'wale secret',resave:false,saveUninitialized:false,store:store}));
app.use((req,res,next)=>{
 
 User.findById('5d7ce5ce008aa7540405971d')
 .then(user=>{
     req.user = user;
     next();
 })
 .catch(err=>{
     console.log(err);
 });
 
});
app.use('/admin',adminRoutes);
app.use(shopRoutes); 
app.use(authRoutes);

app.use(get404Controller.get404Page);

mongoose.connect(MONOGDB_URI)
.then(result=>{
    User.findOne().then(user=>{
        if(!user){
            const user = new User({
                name: 'wale',
                email:'wale@gmail.com',
                cart:{
                    items:[]     
                }
            });
            user.save();
        }
    });
   
    app.listen(3000);
}).catch(err=>{
    console.log(err);
});

 