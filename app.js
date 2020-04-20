var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var registarRouter = require('./routes/registar'); 
var adminRouter = require('./routes/admin'); 

const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

//データベースの設定ーーーーーーーーーーーーーーーーーーーーーーーーー
var User = require('./models/user');
var Timetable = require('./models/timetable');
var Comment = require('./models/comment');
User.sync().then(() => {
  Timetable.belongsTo(User,{foreginKey:'createdBy'});
  Timetable.sync();
  Comment.sync();
});

//app.useの設定ーーーーーーーーーーーーーーーーーーーーーーーーーーーー
var app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:'922a9ce9b228a4c6'}))
app.use(passport.initialize());
app.use(passport.session());

//ルートの設定ーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/login',loginRouter);
app.use('/logout',logoutRouter);
app.use('/registar',registarRouter);
app.use('/admin',adminRouter);


//ログインの設定ーーーーーーーーーーーーーーーーーーーーーーーーーーーー
passport.use(new LocalStrategy({
  userNameField: 'username',
  passwordField: 'password',
  passReqToCallback:  'true',
  session: false
},function(req,username,password,done){
  process.nextTick(function () {
    //TODO データベースからの読み出し
    User.findOne({
      where: {username:username}
    }).then((user) => {
      if (username === user.username && bcrypt.compareSync(password, user.password)) {
        return done(null, {username,id: user.userId});
      } else {
        console.log("login error");
        return done(null, false, { message: 'パスワードが正しくありません。' });
      }
    })
  }) 
}));

//シリアライズ(データをファイルとして保存できる形式に変換)
passport.serializeUser(function (user,done){
  done(null,user);
});
//デシリアライズ（シリアライズした情報をプログラムで処理できるように解凍）
passport.deserializeUser(function(user,done){
  done(null,user);
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
