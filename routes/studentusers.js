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
var sqlQuery = `SELECT * FROM students WHERE login = ? AND password = ?;SELECT * FROM blogs order by id desc limit 3;`;


db.query(sqlQuery, values, function (err, results, fields) {
  if (results.length == 2) {
    req.session.authorised = true;
    req.session.storage=results
    const stud=results[0]
    const blogs=results[1]
    res.render('./student/home',{stud,blogs});
    return;
  } else {  console.log(err,'error')}
});
}); 

router.get('/home/:id', function (req, res, next) {
  const id =req.params.id
  var sqlQuery = `SELECT * FROM students WHERE user_id='${id}';SELECT * FROM blogs order by id desc limit 3;`;

  db.query(sqlQuery, function (err, results, fields) {  
    console.log(results)    
    const stud=results[0]
    const blogs=results[1]
    res.render('./student/home',{stud,blogs});
  });
  });

router.get('/profile/:id', function (req, res, next) {
  const id =req.params.id
  var sqlQuery = `SELECT * FROM students WHERE user_id='${id}';select personal,sc,jc,c from extendedbio where user_id='${id}'  ;`

  db.query(sqlQuery, function (err, results, fields) {  
    const stud=results[0]
    var marks = Object.values(JSON.parse(JSON.stringify(results[1]))) 
    console.log(marks)
    if (marks.length === 0) { console.log("Array is empty!") 
        res.render('./student/profile',{stud});}
        else{
          res.render('./student/profiled',{stud,marks})
        }
  });
  });
router.post('/profile/:id',function(req,res,next){
  const id =req.params.id
  const input=req.body
  console.log(id)
  var sqlQuery = `INSERT INTO extendedbio(user_id,personal,sc, jc,c) VALUES ('${id}','${input.title}','${input.body[0]}', '${input.body[0]}', '${input.body[2]}');`;

  db.query(sqlQuery, function (err, results, fields) {  
    const stud=results
    res.render('./student/profile',{stud});
  });
  }
);

router.get('/blogs/:id', function (req, res, next) {
    const id =req.params.id
    var sqlQuery = `SELECT * FROM blogs order by id desc; select * from students where user_id='${id}'`;
  
    db.query(sqlQuery, function (err, results, fields) {
    const stud=results[1]
    const blogs = results[0]
    console.log(results)
    res.render('./student/blog.ejs',{blogs,stud,id});
  });
  });

router.get('/marks/:id', function (req, res, next) {
  const id =req.params.id
  var sqlQuery = `SELECT * FROM students WHERE user_id = '${id}';select * from marks where user_id='${id}';`
  
  db.query(sqlQuery, function (err, marks, fields) {
    const stud = Object.values(JSON.parse(JSON.stringify(marks)));
    const blogs = Object.values(JSON.parse(JSON.stringify(marks[1])));
    console.log(blogs)
    res.render('./student/marks',{stud,blogs});
  });
});

//Logout
router.get('/exit', function (req, res, next) {

  req.session.destroy(function (err) {
    res.redirect('/');
  });
});

module.exports = router;