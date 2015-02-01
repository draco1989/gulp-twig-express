var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index');
});

/* MODULE Preview */
/* GET Welcome /welcome */
router.get('/welcome', function(req, res, next) {
  res.render('welcome', { items: ['One', 'Two', 'Three'] });
});

/* GET Success /success */
router.get('/success', function(req, res, next) {
  res.render('success', { username: 'User' });
});

module.exports = router;
