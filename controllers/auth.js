
exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie')
    // .split(';')[0]
    // .trim()
    //.split('=')[1];
    // console.log(isLoggedIn);
        res.render('auth/login', {
          path: '/login',
          pageTitle: 'login',
          isAuthenticated: false
      
        });
    };
        exports.postLogin = (req,res,next)=>{
           req.session.isLoggedIn = true;
            res.redirect('/');
        };
