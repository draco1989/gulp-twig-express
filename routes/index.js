var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/welcome', function(req, res, next) {
  res.render('welcome', { users: ['Uno', 'Dos', 'Tres'] });
});

router.get('/success', function(req, res, next) {
  res.render('success', { username: 'Jorge' });
});

module.exports = router;
