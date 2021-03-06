var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');
var router = express.Router();
var bodyParser = require('body-parser');
var parserurlencoded = bodyParser.urlencoded({extended: 'false'}); // to prevent CSRF attacks

mongoose.Promise = global.Promise;

router.get('/', function(req, res) {
    var errors = req.flash('error');
    var error = '';
    if (errors.length) {
        error = errors[0];
    }

    res.render('partials/login', {
        title: 'Chess681 - Login',
        error: error,
        isLoginPage: true
    });
});

router.post('/',
    passport.authenticate('local',{ failureRedirect: '/login', failureFlash: true }),
    function(req, res) {
        User.findOneAndUpdate({_id: req.user._id}, { lastConnection: new Date() }, {} ,function (err, user) {
            req.flash('welcomeMessage', 'Welcome ' + user.name + '!');
            res.redirect('/');
        });
    });

module.exports = router;
