var express = require('express');
var router = express.Router();
var models = require('../models');
var bcrypt = require('bcrypt');

router.get('/', function (req, res, next) {
  res.render('register', { message: 'register' });
});

router.post('/', function (req, res, next) {
  bcrypt.hash(req.body.username, 10, function(err, hash) {
    models.user.create({
      user_name: req.body.username,
      password: hash
    }).then(() => {
      console.log('create success');
    });
  });
});
module.exports = router;
