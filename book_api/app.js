var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var signupRouter = require('./routes/signup');
var loginRouter = require('./routes/login');
/* var homeRouter = require('./routes/home'); */
var bookRouter = require('./routes/book');
var messageRouter = require('./routes/message');
var memberRouter = require('./routes/member');
var transactionRouter = require('./routes/transaction');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
/* app.use('/home', homeRouter); */
app.use('/book', bookRouter);
app.use('/message', messageRouter);
app.use('/member', memberRouter);
app.use('/transaction', transactionRouter);

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

