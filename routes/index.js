var express = require('express');
var router = express.Router();
var passport = require('passport');
var authenticationEnsurer = require('./authentication-ensurer');
var Timetable = require('../models/timetable');
var User = require('../models/user');
var Commnet = require('../models/comment');
const moment = require('moment-timezone');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
var band_TimeTable = (new Array(8)).fill("").map(() => (new Array(9)).fill(""));
var person = (new Array(8)).fill("").map(() => (new Array(9)).fill(""));
var creater = (new Array(8)).fill("").map(() => (new Array(9)).fill(""));

router.get('/',authenticationEnsurer,csrfProtection,function(req, res, next) {
  Timetable.findAll({
    include: [
      {
        model: User,
        attributes: ['userId', 'username']
      }],
    }).then((timetable) => {
      timetable.forEach((table) => {
        band_TimeTable[table.timetable_info_weekday][table.timetable_info_period] = table.band_name;
        person[table.timetable_info_weekday][table.timetable_info_period] = table.responsible_person;
        creater[table.timetable_info_weekday][table.timetable_info_period] = table.createdBy;
      });
      Commnet.findAll()
        .then((comments) => {
          comments.forEach((comment) => {
            comment.formattedUpdatedAt = moment(comment.passtime).tz('Asia/Tokyo').format('YYYY/MM/DD HH:mm');
          });
          res.render('index', {
            user: req.user,
            createdBy: creater,
            band_name: band_TimeTable,
            responsible_person: person,
            comments: comments,
            csrfToken: req.csrfToken()
          });    
      });
  });
});

router.post('/',csrfProtection,(req,res,next) => {
  if (req.body.select === 'send'){
   if(creater[req.body.timetable_info_weekday][req.body.timetable_info_period] === '' || 
      creater[req.body.timetable_info_weekday][req.body.timetable_info_period] === req.user.id)
      {
      Timetable.upsert({
        band_name: req.body.band_name,
        responsible_person: req.body.responsible_person,
        timetable_info_weekday: req.body.timetable_info_weekday,
        timetable_info_period: req.body.timetable_info_period,
        createdBy: req.user.id
      }).then((timetable) => {
        res.redirect('/');
      });
    }else {
      res.redirect('/');
    }
  }else if (req.body.select === 'pass'){
    Timetable.findOne({ 
      include: [
        {
          model: User,
          attributes: ['userId', 'username']
        }],
      where: {
        timetable_info_weekday: req.body.timetable_info_weekday,
        timetable_info_period: req.body.timetable_info_period
      }
    }).then((timetable) => {
      const passtime = new Date();
      console.log(band_TimeTable[timetable.timetable_info_weekday][timetable.timetable_info_period]);
      band_TimeTable[timetable.timetable_info_weekday][timetable.timetable_info_period] = '';
      person[timetable.timetable_info_weekday][timetable.timetable_info_period] = '';
      creater[timetable.timetable_info_weekday][timetable.timetable_info_period] = '';
      Commnet.create({
        band_name: timetable.band_name,
        passtime: passtime
      }).then((comment) => {
        timetable.destroy().then(() => {res.redirect('/');});
      });
    });    
  }
});

//管理者デリート機能


router.post('/delete',csrfProtection,(req,res,next) => {
  Timetable.findAll({
    include: [
      {
        model: User,
        attributes: ['userId', 'username']
      }],
    }).then((timetable) => {
      band_TimeTable = (new Array(8)).fill("").map(() => (new Array(9)).fill(""));
      person = (new Array(8)).fill("").map(() => (new Array(9)).fill(""));
      creater = (new Array(8)).fill("").map(() => (new Array(9)).fill(""));
      const promises = timetable.map((t) => { return t.destroy();});
      Promise.all(promises).then(() => {
        res.redirect('/admin');
    });
  });
});


module.exports = router;
