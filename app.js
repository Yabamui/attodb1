var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var redis = require('redis');
var redisClient = redis.createClient();
var redisStore = require('connect-redis')(session);

// routes require
var members = require('./routes/members');
var auth = require('./routes/auth');
var trades = require('./routes/trades');
var negotiations = require('./routes/negotiations');
var makers = require('./routes/makers');
var portfolioes = require('./routes/portfolioes');
var notices = require('./routes/notices');

var app = express();

app.set('env', 'development');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: true,
//   saveUninitialized: true
// }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: new redisStore({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    client: redisClient
  }),
  resave: true, // 변경이 된게 있을 때만 resave해라!, false일 경우 변경된게 없어도 resave해라.
  saveUninitialized: false // 초기화된게 없으면(저장된게 없으면) 굳이 세션을 만들지 말아라! true일 경우 내용이 없어도 무조건 만듬.
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/images/', express.static(path.join(__dirname, 'upload/member_profile')));

// mount point 지정
app.use('/members', members);
app.use('/auth', auth);
app.use('/trades', trades);
app.use('/trades/:tid/negotiations', negotiations);
app.use('/makers', makers);
app.use('/portfolioes', portfolioes);
app.use('/trades/:tid/notices', notices);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
});


module.exports = app;
