var fs = require('fs');
var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var https = require('https');
var xframeoptions = require('x-frame-options');
var sanitize = require('mongo-sanitize');

mongoose.Promise = global.Promise;

var env = process.env.NODE_ENV || 'default';
var config = require('config');

var app = express();

// configure database
require('./config/database')(app, mongoose);

// bootstrap data models
fs.readdirSync(__dirname + '/models').forEach(function (file) {
    if (~file.indexOf('.js')) require(__dirname + '/models/' + file);
});

// configure express app
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(xframeoptions());
//app.use(bodyParser.text({ type: 'text/html' }))
app.use(cookieParser('A3UR7LE'));
app.use(flash());
app.use(session({ secret: 'CHESS681', saveUninitialized: true, resave: true } ));
app.use(express.static(path.join(__dirname, 'public')));
require('./config/passport')(app, passport);
app.use(passport.initialize());
app.use(passport.session());

// configure gamepages
var gamepages = require('./gamepages/index');
var account = require('./gamepages/account');
var api = require('./gamepages/api');
var play = require('./gamepages/play');
var login = require('./gamepages/login');
var register = require('./gamepages/register');
var middleware = xframeoptions(headerValue='Deny');
var parserurlencoded = app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', gamepages);
app.use('/login', login);
app.use('/register', register);
app.use('/account', account);
app.use('/play', play);
app.use('/api', api);

// configure error handlers
require('./config/errorHandlers.js')(app);

// launch app server with ssl certificate

var server = https.createServer({
    key: fs.readFileSync('Certificates/server681.key'), 
    cert: fs.readFileSync('Certificates/server681.crt'),
    passphrase: ''
},app);

var io = require('socket.io').listen(server);

console.log('app listening on port ' + 3000);

require('./config/socket.js')(server);

module.exports = app;

//var port = process.env.port || 3000;
server.listen(3000);