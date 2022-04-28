function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function Adminlogin(req, res, next) {
  if (req.session.authorised) {
    return;
  } else {
    next()
    return;
  }
}

function Studentlogin(req, res, next) {
  if (req.session.authorised) {
    res.render('./student/home')
    return;
  } else {
    next();
    return;
  }
}


function checkForm(fields) {

  for (var i = 0; i < fields.length; i++) {
    var currElement = fields[i];

    if (currElement == undefined || currElement == '') {
      return false;
    }

  }
  return true;
}

module.exports.checkForm = checkForm;

module.exports.Adminlogin = Adminlogin;

module.exports.Studentlogin = Studentlogin;

module.exports.validateEmail = validateEmail;