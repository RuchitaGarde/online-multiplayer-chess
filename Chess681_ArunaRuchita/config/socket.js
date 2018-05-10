module.exports = function (server) {

    var io = require('socket.io').listen(server);

    var chess =  require('chess.js');

    var games = {};
    var users = 0;

    /*
     * Socketio to monitor events
     */
    var monitor = io.of('/monitor');
    monitor.on('connection', function(socket){
        socket.emit('update', {nbUsers: users, nbGames: Object.keys(games).length});
    });

    /*
     * Socketio event handlers
     */
    io.sockets.on('connection', function (socket) {

        var username = socket.handshake.query.user;

        users++;
        monitor.emit('update', {nbUsers: users, nbGames: Object.keys(games).length});

        /*
         * Player joins a game
         */
        socket.on('join', function (data) {
            var room = data.token;

            // If player is the first to join, initialize players and game array
            if (!(room in games)) {
                var players = [{
                    socket: socket,
                    name: username,
                    status: 'joined',
                    side: data.side
                }, {
                    socket: null,
                    name: "",
                    status: 'open',
                    side: data.side === "black" ? "white" : "black"
                }];
                games[room] = {
                    room: room,
                    creator: socket,
                    status: 'waiting',
                    creationDate: Date.now(),
                    players: players
                };

                socket.join(room);
                socket.emit('wait'); // tell the game creator to wait until a opponent joins the game
                return;
            }

            var game = games[room];

            /* a third player attempts to join the game after already 2 players has joined the game*/
            if (game.status === "ready") {
                socket.emit('full');
            }

            socket.join(room);
            game.players[1].socket = socket;
            game.players[1].name = username;
            game.players[1].status = "joined";
            game.status = "ready";
            io.sockets.to(room).emit('ready', { white: getPlayerName(room, "white"), black: getPlayerName(room, "black") });

        });

        /*
         * A player makes a new move => broadcast that move to the opponent
         */
        socket.on('new-move', function(data) {
            socket.broadcast.to(data.token).emit('new-move', data);
        });

        /*
         * A player resigns => notify opponent, leave game room and delete the game
         */
        socket.on('resign', function (data) {
            var room = data.token;
            if (room in games) {
                io.sockets.to(room).emit('player-resigned', {
                    'side': data.side
                });
                games[room].players[0].socket.leave(room);
                games[room].players[1].socket.leave(room);
                delete games[room];
                monitor.emit('update', {nbUsers: users, nbGames: Object.keys(games).length});
            }
        });

        /*
         * A player disconnects => notify opponent, leave game room and delete the game
         */
        socket.on('disconnect', function(data){
            users--;
            monitor.emit('update', {nbUsers: users, nbGames: Object.keys(games).length});
            for (var token in games) {
                var game = games[token];
                for (var p in game.players) {
                    var player = game.players[p];
                    if (player.socket === socket) {
                        socket.broadcast.to(token).emit('opponent-disconnected');
                        delete games[token];
                        monitor.emit('update', {nbUsers: users, nbGames: Object.keys(games).length});
                    }
                }
            }
        });

    });

    /*
     * Utility function to find the player name of a given side.
     */
    function getPlayerName(room, side) {
        var game = games[room];
        for (var p in game.players) {
            var player = game.players[p];
            if (player.side === side) {
                return player.name;
            }
        }
    }

};