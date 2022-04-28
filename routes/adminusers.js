var express = require('express');
var router = express.Router();
var db = require('../DB/db');
var helpers = require('../helpers/index.js');
var errors = [];

//Admin Login
router.get('/admin', helpers.Adminlogin, function (req, res, next) {
  res.render('./admin/login')
});

router.post('/admin', function (req, res, next) {
  var sqlQuery = `SELECT * FROM admin WHERE login = ? AND psw = ?`
  var values = [req.body.email, req.body.psw];
  db.query(sqlQuery, values, function (err, results, fields){
    if (results.length == 1) {
      const id = results[0].admin_id;
      req.session.authorised = true;
      res.render('./admin/home',{results,id});
      return;
    } else {
      errors.push('The username or password is incorrect.');
      next();
    }
  });
  });

router.get('/ahome/:id', (req, res) => {
    const id= req.params.id;
    var sqlQ = `SELECT * FROM admin WHERE admin_id = ${id}`
    db.query(sqlQ, function (err, results, fields){
    res.render('./admin/home',{id,results});
    });
});

//Register Student
router.get('/aget/:id', (req, res) => {
  const id= req.params.id;
  res.render('./admin/rstudent',{id});
  });

router.post('/catch/:id', (req, res) => {
  const input=req.body
  const id= req.params.id;
  console.log(input)
  var sqlQuery=`INSERT INTO students (user_id, name,Major,Info,login,password) VALUES (NULL, '${input.First_Name +input.Last_Name}', '${input.Major+input.test}', 'NULL', '${2022+input.First_Name}', '${input.Major}');`
  db.query(sqlQuery, function (err, results, fields) {
    if (err==null) {
      console.log('Student Registered',results) 
      res.render('./admin/home',{id});
      var s=`SELECT * FROM  students ORDER BY user_id DESC limit 1`;
      db.query(s, function (err, qai, fields) {
      const newid=qai;
      if(err==null){
        var sqle=`INSERT INTO extendedbio (user_id, Fname, Lname, DOB,email,gender,address) VALUES ('${newid[0].user_id}', '${input.First_Name}', '${input.Last_Name}', '${input.Birthday_Year}-${input.Birthday_Month}-${input.Birthday_day}', '${input.Email_Id}', '${input.Gender}', '${input.Address}');`
        db.query(sqle, function (err, results, fields) {
          if (err==null) {
            console.log('Student Extended Bio',results) 
          }
          else{console.log(err)}
        })
        console.log(newid[0].user_id,'newid')
      }
    })}
    else{
      console.log(err)
      res.redirect('/catch')
}});
});

//Student List
router.get('/alist/:id', (req, res) => {
  const id= req.params.id;
  var sqlQuery = `SELECT * from students`;
    db.query(sqlQuery, function (err, results, fields) {
    const blogs=results
    res.render('./admin/list',{blogs,id});
});
});

//specific query student
router.post('/specific/:id', function (req, res, next) {
console.log(req.body)  
const id= req.params.id;
const selection = req.body.Major+req.body.Semester
var sqlQuery = `SELECT * from students WHERE MAJOR like '${selection}'`;
db.query(sqlQuery, function (err, results, fields) {
  if (err==null) {
    const blogs=results
    res.render('./admin/list',{blogs,id});
  }
  else{
    console.log(err)
    res.redirect('/list/'+id)
  }

});

});
//specific query student MARKS
router.post('/Mspecific/:id', function (req, res, next) {
console.log(req.body)  
const id= req.params.id;
const selection = req.body.Major+req.body.Semester
  var sqlQuery = `SELECT * from students WHERE MAJOR like '${selection}'`;
  db.query(sqlQuery, function (err, results, fields) {
    if (err==null) {
      const blogs=results
      res.render('./admin/marks',{blogs,id});
    }
    else{
      console.log(err)
      res.redirect('/list/'+id)
    }

  });

});

//create blogs
router.get('/ablog/:id', (req, res) => {
  const id= req.params.id;
  res.render('./admin/creblo',{id});
});

router.post('/check/:id', function (req, res, next) {  
const input=req.body
const id= req.params.id;  
console.log(input)
var sqlc=`select name from admin where admin_id=${id}`
db.query(sqlc, function (err, author, fields) {
  if (err==null) {
    const auth= author[0].name
  
    var sqlQuery = `INSERT INTO blogs(id,title,content,Links,author,log) VALUES (NULL, '${input.title}', '${input.body}', '${input.snippet}', '${auth}', NULL); select * from blogs order by id desc;`;
    db.query(sqlQuery, function (err, results, fields) {
      if (err==null) {
        const blogs=results[1]
        res.render('./admin/blogs',{blogs,id});
      }
      else{
        console.log(err)
        res.redirect('/list/')
      }
    })}
  else{
    console.log(err)

  }
})
})

//blogs
router.get('/aablogs/:id', function (req, res, next) {
  const id =req.params.id
  var sqlQuery = `SELECT * FROM blogs order by id desc`;

  db.query(sqlQuery, function (err, results, fields) {
  const blogs = results
  res.render('./admin/blogs.ejs',{blogs,id});
});
});

//list student to Mark
router.get('/amarks/:id', function (req, res, next) { 
  const id= req.params.id;
  var sqlQuery = `SELECT * from students`;
    db.query(sqlQuery, function (err, results, fields) {
    const blogs=results
    res.render('./admin/marks',{blogs,id});
});
});

router.get('/:id/marks/:studentid',function(req,res){
    const id =req.params.id
    const studentid=req.params.studentid
    console.log(id)
    var sqlQuery = `SELECT Major from students WHERE user_id like '${studentid}'`;
    db.query(sqlQuery, function (err, results, fields) {
      if (err==null) {
        const mila =results[0].Major
        console.log(mila)
        var s2qlQuery = `SELECT * FROM subjects WHERE course_id like '${mila}'`;
        db.query(s2qlQuery, function (err, sub, fields) 
        {
          if (err==null) 
              {
                console.log(sub)
                const blogs =sub
                res.render('./admin/gg',{blogs,studentid,id})
              }else{console.log(err)}
        })
      }
      else{console.log(err)}
    }
    )
  }
  )  

router.get('/:id/grade/:sid/:sub',function(req,res){
    console.log(req.params.id,req.params.sub,'Selected Subject')
    const sub=req.params.sub
    const sid=req.params.sid
    const id=req.params.id
    var getexisting = `select * from marks where user_id like '${sid}' and sub_id like '${sub}'`;
    db.query(getexisting, function (err, results, fields) {
      if(err==null){
        
        var marks = Object.values(JSON.parse(JSON.stringify(results)))
        console.log(marks)
        if (marks.length === 0) { console.log("Array is empty!") 
          res.render('./admin/grade',{id,sid,sub})}
        else{
          res.render('./admin/graded',{sid,sub,id,marks})
        }
        
      }
      else{
        console.log(err)
      }
  })
}
);

router.post('/:id/grade/:sid/:sub',function(req,res){
    const id=req.params.id
    const sid=req.params.sid
    const sub=req.params.sub
    const ut1=req.body.ut1
    const ut2=req.body.ut2
    const sem=req.body.sem
    console.log(req.body,'Enter Marks')
    var sqlQuery = `INSERT INTO marks (user_id,sub_id,ut1,ut2,sem) VALUES ('${sid}','${sub}',${ut1},${ut2},${sem});`;
    db.query(sqlQuery, function (err, results, fields) {
      if(err==null){
        res.render('./admin/home',{id})
      }
      else{
        console.log(err)
      }
  })
  })  

module.exports = router;