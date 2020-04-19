var express = require('express');
var router = express.Router();
var passport = require('passport');


router.get('/', function(req, res) {
  res.render('login', { user : req.user });
});

router.post('/', passport.authenticate('local', {
  successRedirect: 'http://localhost:8000/',
  failureRedirect: '/login',
  session: true
}));

module.exports = router;