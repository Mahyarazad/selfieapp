const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
let users = require('../models/users');
const db = require('../models/index.js');

router.get('/register',  (req,res)=>{
  res.render('register');
});

router.post('/register', async(req,res)=>{
  const email = await req.body.email;
  const username = await req.body.username;
  const password = await req.body.password;
  const password2 = await req.body.password2;


  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();
  let check = await db.users.findOne({
    where: {
      email: email
    }
  });

  if(errors){
    console.log(errors);
    res.render('register', {
      errors:errors
    });
  } else if (check === null){
      bcrypt.genSalt(10,  (err,salt)=>{
        bcrypt.hash(password,salt,(err,hash)=>{
          if(err){
            console.log(err);
            return;
          } else {
              try {
                db.users.findOrCreate({
                  where:{
                    email: email,
                    username: username,
                    password: hash,
                    createdat: Date.now(),
                    updatedat: Date.now()
                    }
                  });
                } catch (e) {
                  return res.json({ status: 'error', code: '9999', message: e.message })
                }
              }
          });
        });
  } else if (!check.dataValues.email === email){
      bcrypt.genSalt(10,  (err,salt)=>{
        bcrypt.hash(password,salt,(err,hash)=>{
          if(err){
            console.log(err);
            return;
          } else {
              try {
                db.users.findOrCreate({
                  where:{
                    email: email,
                    username: username,
                    password: hash,
                    createdat: Date.now(),
                    updatedat: Date.now()
                    }
                  });
                } catch (e) {
                  return res.json({ status: 'error', code: '9999', message: e.message })
                }
              }
          });
        });
    } else {
        console.log("this shit is working");
        req.flash("Error","This email has been taken!");
        res.redirect('/user/register');
        return;
       }

  req.flash("Success","You are now registered and can log in");
  res.redirect('/users/login');

});


router.get('/login', (req,res)=>{
  res.render('login');
});


router.post('/login', async(req, res, next)=>{
  passport.authenticate('local',  {
      successRedirect:'/',
      failureRedirect:'/user/login',
      badRequestMessage: req.flash("Error","Check your Username and Password!"), //missing credentials
      failureFlash: true
    })(req, res, next);

});



module.exports = router;
