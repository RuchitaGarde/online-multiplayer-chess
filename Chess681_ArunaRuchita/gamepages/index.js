var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var util = require('../config/util.js');
var User = mongoose.model('User');
mongoose.Promise = global.Promise;

var router = express.Router();

router.get('/', function(req, res) {
           var logoutSuccessMessage = req.flash('logoutSuccess');
           var welcomeMessage = req.flash('welcomeMessage');
           var registerSuccessMessage = req.flash('registerSuccessMessage');
           res.render('partials/index', {
               title: 'Chess681',
               logoutSuccessMessage: logoutSuccessMessage,
               welcomeMessage: welcomeMessage,
               registerSuccessMessage: registerSuccessMessage,
               user: req.user,
               isHomePage: true
           });
       });
   

router.get('/game/:token/:side', function(req, res) {
    var token = req.params.token;
    var side = req.params.side;
    res.render('partials/game', {
        title: 'Chess681 - Game ' + token,
        user: req.user,
        isPlayPage: true,
        token: token,
        side: side
    });
});

router.get('/logout', function(req, res) {
    req.logout();
    req.flash('logoutSuccess', 'You have been successfully logged out');
    res.redirect('/');
});

router.get('/monitor', function(req, res) {
    var mongoStatus = "success";
    res.render('partials/monitor', {
        title: 'Chess681 - Monitor',
        user: req.user,
        status: {
            mongo: mongoStatus,
        }
    });
});

module.exports = router;
