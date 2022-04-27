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
  var sqlQuery = `SELECT * FROM admin WHERE login = ? AND psw = ?`
  var values = [req.body.email, req.body.psw];
  db.query(sqlQuery, values, function (err, results, fields){
    if (results.length == 1) {
      console.log(results)
      req.session.authorised = true;
      res.render('./admin/home',{results});
      return;
    } else {
      errors.push('The username or password is incorrect.');
      next();
    }
  });
  });

//Register Student
router.get('/get/:id', (req, res) => {
  const id= req.params.id;
  res.render('./admin/rstudent',{id});
  });

router.post('/catch', (req, res) => {
  const input=req.body
  var sqlQuery=`INSERT INTO students (user_id, name,Major,Info,login,password) VALUES (NULL, '${input.First_Name+input.Last_Name}', '${input.Major+input.test}', 'NULL', '${2022+input.First_Name}', '${input.Major}');`
  db.query(sqlQuery, function (err, results, fields) {
    if (err==null) {
      console.log('Student Registered') 
      res.redirect('/get');

      var sql1=`SELECT AUTO_INCREMENT FROM  INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'mini-v1' AND  TABLE_NAME   = 'students';`
      db.query(sql1, function (err, results, fields) {
          const ai= results[0].AUTO_INCREMENT-1
          console.log(ai,results[0].AUTO_INCREMENT)
      })
    }
    else{
      console.log(err)
      res.redirect('/catch')
}});
});

//Student List
router.get('/list/:id', (req, res) => {
  const id= req.params.id;
  var sqlQuery = `SELECT * from students`;
    db.query(sqlQuery, function (err, results, fields) {
    const blogs=results
    console.log(blogs)
    res.render('./admin/list',{blogs,id});
});
});

//specific query student
router.post('/specific', function (req, res, next) {
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

//create blogs
router.get('/a-blog', (req, res) => {
  res.render('./admin/creblo');
});
router.post('/check', function (req, res, next) {  
const input=req.body  
console.log(input)
var sqlQuery = `INSERT INTO blogs(id,title,content,Links,author,log) VALUES (NULL, '${input.title}', '${input.body}', '${input.snippet}', 'author-name', NULL);`;
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