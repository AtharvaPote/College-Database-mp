var express = require('express');
var router = express.Router();
var db = require('../db');
var helpers = require('../helpers');
var errors = [];

router.get('/register', helpers.loginChecker, function (req, res, next) {
  res.render('register');
});

router.post('/register', helpers.loginChecker, function (req, res, next) {
  var sqlQuery = `INSERT INTO students(name,login,password) VALUES( ?, ?, MD5(?))`;
  var values = [req.body.fname,req.body.email, req.body.psw];

  db.query(sqlQuery, values, function (err, results, fields) {

    if (err) {
      console.log(err)
      next();
      return;
    }

    if (results.affectedRows == 1) {
      res.redirect('/login');
      return;
    } else {
      errors.push(err.message);
      next();
    }

  });

});

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


router.get('/sec', function (req, res, next) {
  if (req.session.authorised) {
    console.log(req.session.authorised,req.session.fname)
    fname=req.session.user_id
    console.log(req.session.results[0].user_pass)
    res.render('second',{fname});}
  else{
    res.render('register')
  }
  });