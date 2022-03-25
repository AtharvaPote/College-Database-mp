var express = require('express');
const Logger = require('nodemon/lib/utils/log');
var router = express.Router();
var helpers = require('../helpers');
var db = require('../db');

router.get('/',helpers.loginChecker, function (req, res, next) {
    res.render('home')
});

module.exports = router;