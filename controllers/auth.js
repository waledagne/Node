const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGrid = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const {validationResult} = require('express-validator/check');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendGrid({
  auth:{
    api_key:'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'
  }
}));

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
          if (message.length > 0) {
            message = message[0];
          } else {
            message = null;
          }
          res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'login',
            errorMessage: message,
            prevInput:{email:''}
          });
    };
    exports.getsignUp = (req, res, next) => {
      let message = req.flash('error');
          if (message.length > 0) {
            message = message[0];
          } else {
            message = null;
          }
      res.status(422).render('auth/signup', {
        path: '/signup',
        pageTitle: 'SignUp',
        errorMessage: message,
        prevInput:{firstName:'',lastName:'',email:''}
      });
  };
    exports.postLogin = (req, res, next) => {
        const email = req.body.email;
        const password = req.body.password;
        const errors = validationResult(req);

        if(!errors.isEmpty()){
        res.status(422).render('auth/login',{
          path:'/login',
          pageTitle:'Login',
          errorMessage:errors,
          prevInput:{email:email}
          
        })
      }
        User.findOne({email:email})
        .then(user=>{
          if(!user){
             return res.status(422).render('auth/login',{
              path:'/login',
              pageTitle:'Login',
              errorMessage:'Invalid email or password',
              prevInput:{email:email}
              
            })
          }
          bcrypt.compare(password,user.password)
          .then(match=>{
            if(match){
              req.session.isLoggedIn = true;
              req.session.user = user;
              return req.session.save(err=>{
                console.log(err);
                res.redirect('/');
              });
            }
            return res.status(422).render('auth/login',{
              path:'/login',
              pageTitle:'Login',
              errorMessage:'Invalid email or password',
              prevInput:{email:email}
              
            })
            })
            })
            .catch(err => console.log(err));
            };
          
       exports.postSignUp = (req,res,next)=>{
          const firstName =req.body.firstName;
          const lastName= req.body.lastName;
          const email= req.body.email;
          const password = req.body.password;
          const errors = validationResult(req);
          if(!errors.isEmpty()){
            return res.status(422).render('auth/signup',{
                pageTitle:'SignUp',
                path:'/signup',
                errorMessage:errors.array()[0].msg,
                prevInput:{firstName:firstName,lastName:lastName,email:email}
            })
          }
         User.findOne({email:email})
          .then(userObj=>{
            if(userObj){
              req.flash('error','Email already exists');
               return res.redirect('/signup');
            }
            return bcrypt.hash(password,12)
            .then(hashedPassword =>{
              const user = new User({
                firstName:firstName,
                lastName :lastName,
                email:email,
                password:hashedPassword,
                cart:{ items:[] }
              });
              return user.save();
            })
            .then(result=>{
              res.redirect('/login');
              return transporter.sendMail({
                to:email,
                from:'nodeapp.com',
                subject:'Signed up successfully',
                html:'<h1> You successfully signed up</h1>'
              });
            })
            .catch(err=>{
              console.log(err);
            });
          })     
       }
      exports.postLogout = (req, res, next) => {
        req.session.destroy(err => {
          console.log(err);
          res.redirect('/');
        });
      };

      exports.getReset = (req,res,next) => {
        let message = req.flash('error');
        if (message.length > 0) {
          message = message[0];
        } else {
          message = null;
        }
        res.render('auth/reset',{
          path:'/reset',
          pageTitle:'Reset Password',
          errorMessage:message
        });
      };
  exports.postReset = (req,res,next) =>{
    crypto.randomBytes(32,(err,buffer) =>{
      if(err){
        console.log(err);
        return res.redirect('/reset');
      }
      const token = buffer.toString('hex');
      User.findOne({email:req.body.email})
      .then(user=>{
        if(!user){
          req.flash('error','No account with this email');
           return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration =Date.now() + 3600000;
        return user.save();
      })
      .then(result=>{
        res.redirect('/');
        transporter.sendMail({
          to:req.body.email,
          from:'nodeapp.com',
          subject:'password reset',
          html:`
               <p> You requsted password reset</p>
               <p> click this link <a href="http://localhost:3000/reset/${token}"> to reset your password</p>
           `
        });
      })
      .catch(err=>{
        console.log(err);
      })
    })
  };
   
  exports.getNewPassword = (req,res,next) =>{
    const token = req.params.token;
    User.findOne({resetToken:token,resetTokenExpiration:{$gt:Date.now()}})
    .then(user=>{
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-pass',{
        path:'/new-pass',
        pageTitle:'New password',
        errorMessage:message,
        userId: user._id.toString(),
        passwordToken: token,
       
      })
    })
    .catch(err=>{console.log(err)});
  }
  exports.postNewPassword = (req,res,next) =>{
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne({resetToken:passwordToken,resetTokenExpiration:{$gt:Date.now()},_id:userId})
    .then(user=>{
      resetUser = user;
      return bcrypt.hash(newPassword,12);
    })
    .then(hashedPassword =>{
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(results=>{
      res.redirect('/login');
    })
    .catch(err=>{
      console.log(err);
    });
  };
    