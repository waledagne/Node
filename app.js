const express =   require('express'); 
const path = require('path');
const bodyParser= require('body-parser');
const get404Controller = require('./controllers/404');



const adminRoutes= require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app= express(); 
app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminRoutes);
app.use(shopRoutes); 

app.use(get404Controller.get404Page);

app.listen(3000); 
 