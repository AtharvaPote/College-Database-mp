var express = require('express');
var router = express.Router();
var db = require('../DB/db');
var helpers = require('../helpers');

//Student Login
router.get('/login-student', helpers.Studentlogin, function (req, res, next) {
    res.render('./student/login')
  });
  
  router.post('/login-student', function (req, res, next) {
  var sqlQuery = `SELECT * FROM students WHERE login = ? AND password = MD5(?)`;
  var values = [req.body.email, req.body.psw];
  
  db.query(sqlQuery, values, function (err, results, fields) {
    if (results.length == 1) {
      req.session.authorised = true;
      blogs=results
      console.log(results)
      res.render('./student/home',{blogs});
      return;
    } else {
      errors.push('The username or password is incorrect.');
      next();
    }
  });
  });  
  
  //Logout
  router.get('/exit', function (req, res, next) {
  
    req.session.destroy(function (err) {
      res.redirect('/');
    });
  });
  
module.exports = router;