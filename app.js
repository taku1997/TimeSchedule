const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const cron = require('node-cron');

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const registarRouter = require('./routes/registar'); 
const adminRouter = require('./routes/admin');


//データベースの設定ーーーーーーーーーーーーーーーーーーーーーーーーー
const User = require('./models/user');
const Timetable = require('./models/timetable');
const Comment = require('./models/comment');
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
      where: {username}
    }).then((user) => {
      if(username && password){
        if (user !== null && bcrypt.compareSync(password, user.password)) {
          return done(null, {username,id: user.userId});
        } else {
          console.log("login error");
          return done(null, false, { message: 'パスワードが正しくありません。' });
        }
      }else{
        console.log("login error");
        return done(null, false, { message: 'ユーザネームまたはパスワードが入力されていません' });
      }
    });
  }); 
}));

//シリアライズ(データをファイルとして保存できる形式に変換)
passport.serializeUser(function (user,done){
  done(null,user);
});
//デシリアライズ（シリアライズした情報をプログラムで処理できるように解凍）
passport.deserializeUser(function(user,done){
  done(null,user);
})


//タイムテーブルデータの初期化 
cron.schedule('59 59 23 * * *',() => {
  let nowDate = new Date().getDate();
  console.log(nowDate)
  const jack_week = [3,4,5,6,0,1,2]
  Timetable.findAll({
    where:{timetable_info_period: jack_week[nowDate]}
  }).then(contents => {
    contents.forEach(content => {
      content.destroy().then(() => {console.log("データベースの初期化")});
    });
  });
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
