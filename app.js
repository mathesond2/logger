const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const logger = require('morgan');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
const indexRouter = require('./routes/index');
require('./handlers/passport');
const app = express();
const bodyParser = require('body-parser');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Exposes a bunch of methods for validating data. Used heavily on userController.validateRegister
app.use(expressValidator());

app.use(cookieParser('secret'));
app.use(session({ cookie: { maxAge: 60000, } }));

// Passport JS is what we use to handle our logins
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.flashes = req.flash();
  next();
});

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // set locals, only providing error in development
  res.locals.message = err.message;
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
