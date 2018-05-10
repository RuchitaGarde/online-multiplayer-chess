var express = require('express');
var mongoose = require('mongoose');
var util = require('../config/util.js');
var router = express.Router();
var moment = require('moment');
var sanitize = require('mongo-sanitize'); // to avoid nosql injection attacks
var bodyParser = require('body-parser');
var parserurlencoded = bodyParser.urlencoded({extended: 'false'}); // to prevent CSRF attacks
mongoose.Promise = global.Promise;

/* GET user account details. */
router.get('/', function(req, res) {
    res.render('partials/account', {
        title: 'Chess681 - Account',
        user: req.user,
        isAccountPage: true,
        lastConnection: moment(req.user.lastConnection).fromNow(),
        updateStatus: req.flash('updateStatus'),
        updateMessage: req.flash('updateMessage')
    });
});

/* Update user account. */
router.post('/', parserurlencoded, function(req, res) {
    var User = mongoose.model('User');
    var currentPassword = sanitize(req.body.password);
    var newPassword = sanitize(req.body.newPassword);
    var confirmNewPassword = sanitize(req.body.confirmNewPassword);
    var passwordRegex = sanitize(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/);
    var hash = util.encrypt(currentPassword);
    if ( hash === sanitize(req.user.password) ) {
        if(passwordRegex.test(newPassword) == true){
            if ( newPassword === confirmNewPassword ) {
                var newPasswordHash = util.encrypt(newPassword);
                User.findOneAndUpdate({_id: req.user._id}, { password: newPasswordHash }, {} ,function (err, user) {
                    req.user = user;
                    req.flash('updateStatus', true);
                    req.flash('updateMessage', 'Your password has been updated successfully');
                    res.redirect('/account');
                });
            } else {
                req.flash('updateStatus', false);
                req.flash('updateMessage', 'The confirmation password does not match the new password');
                res.redirect('/account');
            }
        } else {
            req.flash('updateStatus', false);
            req.flash('updateMessage', 'Password must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters');
            res.redirect('/account');
        }
    } else {
        req.flash('updateStatus', false);
        req.flash('updateMessage', 'The current password is incorrect');
        res.redirect('/account');
    }
});

module.exports = router;
