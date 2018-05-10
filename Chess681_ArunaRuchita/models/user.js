var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var util = require('../config/util.js');
mongoose.Promise = global.Promise;

var UserSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    lastConnection: { type: Date, default: Date.now }
});
//authenticating the user by comparing the user entered password with the salted hash password
UserSchema.methods = {
    authenticate: function (plainText) {
        return bcrypt.compareSync(plainText, this.password);
    }

};

mongoose.model('User', UserSchema);