const express =   require('express'); 
const path = require('path');
const bodyParser= require('body-parser');
const session = require('express-session');
const get404Controller = require('./controllers/404');
const mongoose = require('mongoose');
const mongoSession = require('connect-mongodb-session')(session );
const csrf = require('csurf');
const flash = require('connect-flash')
const User = require('./models/user');

const adminRoutes= require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const MONOGDB_URI = "mongodb://localhost:27017/shop?";
const app= express(); 
app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

const store = new mongoSession({
    uri:  MONOGDB_URI,
    collection: 'sessions'
})
const csrfProtection = csrf();


app.use(session({secret:'wale secret',resave:false,saveUninitialized:false,store:store}));
app.use(csrfProtection);
app.use(flash());
app.use((req,res,next)=>{
    if (!req.session.user) {
        return next();
      }
 User.findById(req.session.user._id)
 .then(user=>{
     req.user = user;
     next();
 })
 .catch(err=>{
     console.log(err);
 });
 
});
app.use((req,res,next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrf = req.csrfToken();
    next();
})
app.use('/admin',adminRoutes);
app.use(shopRoutes); 
app.use(authRoutes);

app.use(get404Controller.get404Page);

mongoose.connect(MONOGDB_URI)
.then(result=>{
    app.listen(3000);
}).catch(err=>{
    console.log(err);
});

 