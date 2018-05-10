$( document ).ready(function() {

    var defaultChessboardCfg = {
        pieceTheme: '/chessboardjs/img/chesspieces/wikipedia/{piece}.png'
    };

    /*
     * When the user is logged in, it's name is loaded in the "data" attribute of the "#loggedUser" element.
     * This name is then passed to the socket connection handshake query
     */
    var username;
    var time_out=150;// 2 and half minutes in seconds
    if($("#loggedUser").length) {
        username = $("#loggedUser").data("user");
    } else {
        username = "Anonymous";
    }

    // socket used for real time games
    var socket = io('https://localhost:3000', { query: 'user=' + username});

    // socket used to broadcast events to monitoring page
    var monitorSocket = io('https://localhost:3000/monitor');

    /*
     * Show error message on login failure
     */
    if ($("#loginError").length && !$("#loginError").is(':empty')) {

        Messenger({
            extraClasses: 'messenger-fixed messenger-on-right messenger-on-bottom'
        }).post({
            message: $("#loginError").html(),
            type: 'error',
            showCloseButton: true,
            hideAfter: 10
        });
    }

    /*
     * Show error message on registration failure
     */
    if ($("#registerError").length && !$("#registerError").is(':empty')) {

        Messenger({
            extraClasses: 'messenger-fixed messenger-on-right messenger-on-bottom'
        }).post({
            message: $("#registerError").html(),
            type: 'error',
            showCloseButton: true,
            hideAfter: 10
        });
    }

    /*
     * Show message on successful logout
     */
    if ($("#logoutSuccess").length && !$("#logoutSuccess").is(':empty')) {

        Messenger({
            extraClasses: 'messenger-fixed messenger-on-right messenger-on-bottom'
        }).post({
            message: $("#logoutSuccess").html(),
            type: 'success',
            showCloseButton: true,
            hideAfter: 10
        });
    }

    /*
     * Show welcome message on registration success
     */
    if ($("#registerSuccess").length && !$("#registerSuccess").is(':empty')) {

        Messenger({
            extraClasses: 'messenger-fixed messenger-on-center messenger-on-bottom'
        }).post({
                message: $("#registerSuccess").html(),
                type: 'success',
                showCloseButton: true,
                hideAfter: 10
            });
    }

    /*
     * Show welcome message on login success
     */
    if ($("#welcomeMessage").length && !$("#welcomeMessage").is(':empty')) {

        Messenger({
            extraClasses: 'messenger-fixed messenger-on-right messenger-on-bottom'
        }).post({
            message: $("#welcomeMessage").html(),
            type: 'success',
            showCloseButton: true,
            hideAfter: 10
        });
    }

    /*
     * Show message on account update success
     */
    if ($("#updateStatus").length && !$("#updateStatus").is(':empty')) {

        var ok = $("#updateStatus").data('ok');
        var message = $("#updateStatus").html();

        Messenger({
            extraClasses: 'messenger-fixed messenger-on-right messenger-on-bottom'
        }).post({
            message: message,
            type: ok ? 'success' : 'error',
            showCloseButton: true,
            hideAfter: 10
        });
    }

    /*
     * Game page
     */
    if ($("#board").length) {

        /*
         * Initialize a new game
         */
        var game = new Chess();
        var pgnEl = $('#pgn');
        var token = $("#board").data('token');
        var side = $("#board").data('side');
        var opponentSide = side === "black" ? "white" : "black";

	/*
         * Timer : displays time taken by each player while making moves
         */
        var timer=function(time_set)
        {
            if(true)
            {
                if(game.turn().toString()=='w')
                {
                    time_set[0]+=1;
                    if(time_set[0]>time_out)
                    {
                        //handle time out
                        $('#gameResult').html('TimeOut! Black Won !');
                        $('#gameResultPopup').modal({
                            keyboard: false,
                            backdrop: 'static'
                        });
                        clearInterval(timer_interval);
                    }
                    $("#timew").html(("00" + Math.floor(time_set[0]/60)).slice (-2)+":"+("00" + time_set[0]%60).slice (-2));
                }
                if(game.turn().toString()=='b')
                {
                    time_set[1]+=1;
                    if(time_set[1]>time_out)
                    {
                        //handle time out
                        $('#gameResult').html('TimeOut!  White Won !');
                        $('#gameResultPopup').modal({
                            keyboard: false,
                            backdrop: 'static'
                        });
                        clearInterval(timer_interval);
                    }
                    $("#timeb").html(("00" + Math.floor(time_set[1]/60)).slice (-2)+":"+("00" + time_set[1]%60).slice (-2));
                }
            }
            return time_set;
        };

        /*
         * When a piece is dragged, check if it the current player has the turn
         */
        var onDragStart = function(source, piece, position, orientation) {
            if (game.gameOver() === true ||
                (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
                (game.turn() === 'b' && piece.search(/^w/) !== -1) ||
                (game.turn() !== side.charAt(0) )) {
                return false;
            }
        };

        /*
         * When a piece is dropped, check if the move is legal
         */
        var onDrop = function(source, target, piece, newPos, oldPos, orientation) {
            // see if the move is legal
            var move = game.move({
                from: source,
                to: target,
                promotion: 'q' // NOTE: always promote to a queen for example simplicity
            });

            // illegal move
            if (move === null) return 'snapback';
            pgnEl.html(game.pgn());
            $('.turn').removeClass("fa fa-spinner");
            $('#turn-' + game.turn()).addClass("fa fa-spinner");
            socket.emit('new-move', {
                token: token,
                source: source,
                target: target,
                piece: piece,
                newPosition: ChessBoard.objToFen(newPos),
                oldPosition: ChessBoard.objToFen(oldPos)
            });
        };

        // update the board position after the piece snap
        // for castling, en passant, pawn promotion
        var onSnapEnd = function() {
            board.position(game.fen());
        };

        /*
         * Initialize a new board
         */
        var cfg = _.extend(defaultChessboardCfg, {
            draggable: true,
            position: 'start',
            moveSpeed: 'slow',
            onDragStart: onDragStart,
            onSnapEnd: onSnapEnd,
            onDrop: onDrop,
            snapbackSpeed: 500,
            snapSpeed: 150,
            orientation: side
        });
        var board = new ChessBoard('board', cfg);

        /*
         * When the game page is loaded, fire a join event to join the game room
         */
        socket.emit('join', {
            'token': token,
            'side': side
        });

        /*
         * When a new game is created, the game creator should wait for an opponent to join the game
         */
        socket.on('wait', function () {
            var url = "https:/localhost:3000/game/" + token + "/" + opponentSide;
            $('#gameUrl').html(url);
            $('#gameUrlPopup').modal({ // show modal popup to wait for opponent
                keyboard: false,
                backdrop: 'static'
            });
        });

        /*
         * A second player has joined the game => the game can start
         */
        socket.on('ready', function (data) {
	    //intialize the timer
            var time_sets=[0,0];
            timer_interval=setInterval(function(){ time_sets=timer(time_sets)}, 1000);//repeat every second
            $('#turn-w').addClass("fa fa-spinner");
            $('#player-white').html(data.white);
            $('#player-black').html(data.black);
            $('#gameUrlPopup').modal('hide');
        });

        /*
         * A new move has been made by a player => update the UI
         */
        socket.on('new-move', function(data){
            game.move({ from: data.source, to: data.target });
            board.position( game.fen() );
            pgnEl.html(game.pgn());
            $('.turn').removeClass("fa fa-spinner");
            $('#turn-' + game.turn()).addClass("fa fa-spinner");
        });

        /*
         * A player resigns the game
         */
        $('#resignButton').click(function (ev) {
            ev.preventDefault();
            socket.emit('resign', {
                'token': token,
                'side': side
            });
        });

        /*
         * Notify opponent resignation
         */
        socket.on('player-resigned', function (data) {
            $('#gameResult').html(data.side + ' resigned.');
            $('#gameResultPopup').modal({
                keyboard: false,
                backdrop: 'static'
            });
        });

        /*
         * Notify opponent disconnection
         */
        socket.on('opponent-disconnected', function () {
            $('#gameResult').html('Your opponent has been disconnected.');
            $('#gameResultPopup').modal({
                keyboard: false,
                backdrop: 'static'
            });
        });

        /*
         * Notify that the game is full => impossible to join the game
         */
        socket.on('full', function () {
            alert("This game has been already joined by another person.");
            window.location = '/';
        });

    }

    /*
     * Monitoring page
     */
    if ($("#monitor").length) {

        var nbUsers, nbGames;

        monitorSocket.on('update', function(data) {
            /*
             * load monitoring event data
             */
            nbUsers = data.nbUsers;
            nbGames = data.nbGames;
            $("#nbUsers").html(nbUsers);
            $("#nbGames").html(nbGames);
        });    
    }
});