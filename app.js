var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models = require('./models');

var index = require('./routes/index');
var login = require('./routes/login');
var register = require('./routes/register');
var users = require('./routes/users');

var app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(user, done) {
  user.findById(id, function(err, user) {
    done(err, user);
  });
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//passport strategy config
passport.use(new LocalStrategy(
  // {
  //  usernamefield: 'user_name',
  //  passwordField: 'password'
  // },
  function(username, password, done) {
    models.user.findOne({ username: username }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: '用户名不存在' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: '密码不匹配' });
      }
      return done(null, user);
    });
  }
));

app.use('/', index);
app.use('/login', login);
app.use('/register', register);
app.use('/users', users);

app.post('/login', (req, res, next) => {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
  })(req, res, next);
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
