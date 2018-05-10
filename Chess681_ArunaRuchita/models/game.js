var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
var GameSchema = mongoose.Schema({
    user: { type: Schema.ObjectId, ref: 'User' },
    white: String,
    black: String,
    pgn: String,
    result: String
});

mongoose.model('Game', GameSchema);