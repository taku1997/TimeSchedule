var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
var authenticationEnsurer = require('./authentication-ensurer');


router.get('/',authenticationEnsurer,(req,res,next) => {
  res.render('admin',{csrfToken: req.csrfToken()})
});

router.post('/comment',authenticationEnsurer,csrfProtection,function(req,res,next){
  Comment.findAll().then((comments) => {
    const promises = comments.map((c) => { return c.destroy();});
    Promise.all(promises).then(() => {
      res.redirect('/admin');
    });
  });
});

module.exports = router;