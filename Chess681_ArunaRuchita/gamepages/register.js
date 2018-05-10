var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var util = require('../config/util.js');
var User = mongoose.model('User');
var router = express.Router();
var sanitize = require('mongo-sanitize');
var bodyParser = require('body-parser');
var parserurlencoded = bodyParser.urlencoded({extended: 'false'}); // to prevent CSRF attacks
mongoose.Promise = global.Promise;

router.get('/', function(req, res) {
    var errors = req.flash('error');
    var error = '';
    if (errors.length) {
        error = errors[0];
    }

    res.render('partials/register', {
        title: 'Chess681 - Register',
        error: error,
        isLoginPage: true
    });
});

router.post('/',parserurlencoded, function(req, res, next) {

    var email = sanitize(req.body.email);
    var name = sanitize(req.body.userName);
    var password = sanitize(req.body.password);
    var confirmPassword = sanitize(req.body.confirmPassword);
    var emailRegex = sanitize(/^[A-Za-z0-9._%+-]+@([a-z]+\.){1,2}[a-z]{2,3}$/);
    var passwordRegex = sanitize(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/);

    if(emailRegex.test(email) == true) {  // email input validation before querying db
        User.findOne({email: email} ,function (err, user) {
            if (user !== null) {
                req.flash('registerStatus', false);
                req.flash('error', 'We have already an account with email: ' + email);
                res.redirect('/register');
            } else { // no user found
                if(passwordRegex.test(password) == true) {  // password input validation
                    if(password === confirmPassword) {
                        var u = new User({ name: name, email: email, password: util.encrypt(password) });
                        u.save(function (err) {
                            if (err) {
                                next(err);
                            } else {
                                //console.log('new user:' + u);
                                req.login(u, function(err) {
                                    if (err) { return next(err); }
                                    req.flash('registerStatus', true);
                                    req.flash('registerSuccessMessage', 'Welcome ' + u.name + "!");
                                    return res.redirect('/');
                                });
                            }
                        });
                    } else {
                        req.flash('registerStatus', false);
                        req.flash('error', 'The confirmation password does not match the password');
                        res.redirect('/register');
                    }
                } else {
                    req.flash('registerStatus', false);
                    req.flash('error', 'Password does not match the conditions provided');
                    res.redirect('/register');
                }
    
            }
        });
    } else {
        req.flash('registerStatus', false);
        req.flash('error', 'Email does not match the conditions provided');
        res.redirect('/register');
    }    
});

module.exports = router;
