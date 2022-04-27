var express = require('express');
var router = express.Router();
var db = require('../DB/db');
var helpers = require('../helpers');
//Student Login
router.get('/login-student', function (req, res, next) {
  res.render('./student/login')
});

router.post('/login-student', function (req, res, next) {
var values = [req.body.email, req.body.psw];
var sqlQuery = `SELECT * FROM students WHERE login = ? AND password = ?;select * from blogs limit 3;`;


db.query(sqlQuery, values, function (err, results, fields) {
  if (results.length == 2) {
    req.session.authorised = true;
    req.session.storage=results
    const stud=results[0]
    const blogs=results[1]
    console.log(results)
    res.render('./student/home',{stud,blogs});
    return;
  } else {  console.log(err,'error')}
});
}); 

router.get('/home/:id', function (req, res, next) {
  const id =req.params.id
  var sqlQuery = `SELECT * FROM students WHERE user_id='${id}';select * from blogs limit 3;`;

  db.query(sqlQuery, function (err, results, fields) {  
    console.log(results)    
    const stud=results[0]
    const blogs=results[1]
    res.render('./student/home',{stud,blogs});
  });
  });

router.get('/profile/:id', function (req, res, next) {
  const id =req.params.id
  var sqlQuery = `SELECT * FROM extendedbio WHERE user_id='${id}'`;

  db.query(sqlQuery, function (err, results, fields) {  
    const stud=results
    res.render('./student/profile',{stud});
  });
  });

router.get('/blogs/:id', function (req, res, next) {
    const id =req.params.id
    var sqlQuery = `SELECT * FROM blogs;select * from students where user_id='${id}'`;
  
    db.query(sqlQuery, function (err, results, fields) {
    const stud=results[1]
    const blogs = results[0]
    console.log(results)
    res.render('./student/blog.ejs',{blogs,stud,id});
  });
  });

router.get('/marks/:id', function (req, res, next) {
  const id =req.params.id
  var sqlQuery = `SELECT * FROM students WHERE user_id = '${id}'`;
  
  db.query(sqlQuery, function (err, results, fields) {
    const stud=results
    res.render('./student/marks',{stud});
  });
  });

//Logout
router.get('/exit', function (req, res, next) {

  req.session.destroy(function (err) {
    res.redirect('/');
  });
});

module.exports = router;