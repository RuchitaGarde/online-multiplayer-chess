var express = require('express');
var util = require('../config/util.js');
var router = express.Router();
var mongoSanitize = require('express-mongo-sanitize');
var bodyParser = require('body-parser');
var parserurlencoded = bodyParser.urlencoded({extended: 'false'}); // to prevent CSRF attacks

router.get('/', function(req, res) {
    res.render('partials/play', {
        title: 'Chess681 - Game',
        user: req.user,
        isPlayPage: true
    });
});

router.post('/',parserurlencoded, function(req, res) {
    var side = req.body.side;
    var token = util.randomString(20);
    res.redirect('/game/' + token + '/' + side);
});

module.exports = router;