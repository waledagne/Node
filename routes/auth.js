const express = require('express');
const {check,body} = require('express-validator/check')
const authController = require('../controllers/auth');
const User = require('../models/user');
const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup',authController.getsignUp);

router.post('/login', authController.postLogin);

router.post('/signup',check('email').isEmail().withMessage('please enter a valid email address')
                      .normalizeEmail()
                      .custom((value, { req })=>{
                        return User.findOne({email:value})
                        .then(userObj=>{
                          if(userObj){
                           return Promise.reject('This Email address is already exits');
                          }
                        });
                      }).normalizeEmail()
                      ,
                      body('password','your password must be 8 characters long')
                      .isLength({min:8}).trim(),
                      body('confirmPassword').trim().custom((value,{ req }) =>{
                          if(value !== req.body.password){
                              throw new Error("your passwords didn't match please try again")
                          }
                          return true;
                      }),authController.postSignUp);

router.post('/logout', authController.postLogout);

router.get('/reset',authController.getReset);

router.post('/reset',authController.postReset);

router.get('/reset/:token',authController.getNewPassword);

router.post('/new-pass',authController.postNewPassword);

module.exports = router;