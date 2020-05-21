const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.get('/',(req,res,next) => {
  res.render('registar')
});

router.post('/',function(req,res,next){
  if(req.body.secretword === 'jackandbeans'){
    User.findOrCreate({
      where:{username: req.body.username},
      defaults:{
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8)),
      }
    }).then(([user,created]) => {
      if(created){
        res.redirect('/login');
      }else{
        res.render('registar',{status: 'not_found'});
      }
    });
  } else {
    res.render('registar',{status: 'not_secret'});
  }
});

module.exports = router;
