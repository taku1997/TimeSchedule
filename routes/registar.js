var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var User = require('../models/user');

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
      if(created){//新規登録されたなら
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
  //hash: hash