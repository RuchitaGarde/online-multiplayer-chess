var config = require('config');

module.exports = function (app, mongoose) {

    var connect = function () {
        var options = {
            server: {
                socketOptions: { keepAlive: 1 }
            },
            auto_reconnect:true
        };
        mongoose.connect(config.get('chess_681.db'), options);
    };
    connect();

    // Handles Errors
    mongoose.connection.on('error', function (err) {
        console.error('MongoDB Connection Error. Please make sure MongoDB is running. -> ' + err);
    });

    // When closed reconnect
    mongoose.connection.on('disconnected', function () {
        connect();
    });

};