var mongoose         = require('mongoose');
var LocalStrategy    = require('passport-local').Strategy;
var User             = mongoose.model('User');
mongoose.Promise = global.Promise;

module.exports = function (app, passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({ _id: id }, function (err, user) {
            done(err, user)
        });
    });

    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {

            User.findOne( { email: email } , function (err, user) {

                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(null, false, { message: 'Invalid username or password' });
                }

                if (!user.authenticate(password)) {
                    return done(null, false, { message: 'Invalid username or password' });
                }

                return done(null, user);
            });
        }
    ));

};