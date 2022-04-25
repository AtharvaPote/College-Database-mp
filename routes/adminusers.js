var express = require('express');
var router = express.Router();
var db = require('../DB/db');
var helpers = require('../helpers/index.js');
var errors = [];



//Admin Login
router.get('/login-admin', helpers.Adminlogin, function (req, res, next) {
  res.render('./admin/login')
});

router.post('/login-admin', function (req, res, next) {
  var sqlQuery = `SELECT * FROM admin WHERE login = ? AND psw = MD5(?)`;
  var values = [req.body.email, req.body.psw];
  console.log(values)
  db.query(sqlQuery, values, function (err, results, fields){
    if (results.length == 1) {
      console.log(results)
      req.session.authorised = true;
      blogs=results[0].pass
      res.render('./admin/home',{blogs,results});
      return;
    } else {
      errors.push('The username or password is incorrect.');
      next();
    }
  });
  });

//Register Student
router.get('/admin-create',helpers.Adminlogin, function (req, res) {
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

//Student List
router.get('/list', (req, res) => {

  var sqlQuery = `SELECT * from students`;
    db.query(sqlQuery, function (err, results, fields) {
    const blogs=results
    console.log(blogs)
    res.render('./admin/list',{blogs});
});
});

//specific query student
router.post('/get', function (req, res, next) {
  console.log(req.body)  
  const selection = req.body.Major+req.body.Semester
    var sqlQuery = `SELECT * from students WHERE MAJOR like '${selection}'`;
    db.query(sqlQuery, function (err, results, fields) {
      if (err==null) {
        const blogs=results
        console.log('successful',blogs)
        res.render('./admin/list',{blogs});
      }
      else{
        console.log(err)
        res.redirect('/list')
      }
  
    });
  
  });

module.exports = router;