var express = require('express');
const Logger = require('nodemon/lib/utils/log');
var router = express.Router();
var helpers = require('../helpers');
var db = require('../DB/db');

router.get('/', function (req, res, next) {
    res.render('home')
});

module.exports = router;