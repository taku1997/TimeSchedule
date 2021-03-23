const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('/', function(req, res) {
  const errorMessage = req.flash('error')
  res.render('login', { user : req.user, message: errorMessage});
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  session: true
}));

module.exports = router;