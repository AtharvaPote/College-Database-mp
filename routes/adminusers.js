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