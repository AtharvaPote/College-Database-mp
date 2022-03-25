var express = require('express');
var router = express.Router();
var db = require('../db');
var helpers = require('../helpers');
var errors = [];

router.get('/login', helpers.loginChecker, function (req, res, next) {
    res.render('./student/s_login')
  });
  
  router.post('/login', function (req, res, next) {
    var sqlQuery = `SELECT * FROM students WHERE login = ? AND password = MD5(?)`;
    var values = [req.body.email, req.body.psw];
  
    db.query(sqlQuery, values, function (err, results, fields) {
      if (results.length == 1) {
        req.session.authorised = true;
        blogs=results
        console.log(results)
        res.render('hello',{blogs});
        return;
      } else {
        errors.push('The username or password is incorrect.');
        next();
      }
    });
  });  
  
router.get('/exit', function (req, res, next) {
  
    req.session.destroy(function (err) {
      res.redirect('/');
    });
  });
  
module.exports = router;