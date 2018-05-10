module.exports = function (app) {

    // error handler catches and handles 404
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // print stacktrace
    if (app.get('env') === 'default') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('partials/error', {
                message: err.message,
                error: err
            });
        });
    }

    // user cant access stackstace
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('partials/error', {
            message: err.message,
            error: {}
        });
    });

}