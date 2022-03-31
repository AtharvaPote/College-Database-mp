var express = require('express');
var router = express.Router();
var db = require('../DB/db');
var helpers = require('../helpers');
var errors = [];

//Register User
router.get('/admin-create', function (req, res) {
  res.render('./admin/create')
});

router.post('/register', function (req, res, next) {
  const addsem = req.body.Major+req.body.semester
  const psw = req.body.name+'123'
  var sqlQuery = `INSERT INTO students(name,Major,info,login,password) VALUES( ?, ?, ?, ?, MD5(?))`;
  var values = [req.body.name,addsem,req.body.info,req.body.login,psw];
  console.log(sqlQuery)
  db.query(sqlQuery, values, function (err, results, fields) {

    if (err) {
      console.log(err)
    }
  });

});

//Admin Login
router.get('/login-admin', helpers.Adminlogin, function (req, res, next) {
  res.render('./admin/login')
});

router.post('/login-admin', function (req, res, next) {
  var sqlQuery = `SELECT * FROM admin WHERE login = ? AND psw = MD5(?)`;
  var values = [req.body.email, req.body.psw];
  console.log(values)
  db.query(sqlQuery, values, function (err, results, fields) {
    if (results.length == 1) {
      req.session.authorised = true;
      blogs=results[0].pass
      res.render('./admin/home',{blogs});
      return;
    } else {
      errors.push('The username or password is incorrect.');
      next();
    }
  });
  });



module.exports = router;