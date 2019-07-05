const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require( 'cookie-parser');
const logger = require('morgan');
const config = require('./config');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var areaRouter = require('./routes/areas');

require('./models')

//var RedisStore = require('connect-redis')(session);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/areas', areaRouter);

//redis session
/*
app.use(session({
  name : "sid",
  secret : config.session_secret,
  resave : false,
  rolling : true,
  saveUninitialized : false,
  cookie : config.cookie,
  store : new RedisStore({
    port: config.redis_port,
    host: config.redis_host,
    db: config.redis_db,
    pass: config.redis_password,
  })
}));
*/

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