# online-multiplayer-chess

This repository contains the codebase for an online multiplayer chess game that we developed. The Assurance case is available as a pdf report which justifies why this game is secure by exploring all the possible security vulnerabilities that may arise while using this application.

## Technology Stack
You need the following things installed on your system to play the game.

### Server:
	• Node JS – Web Server Node.js v8.9.1
	• Express JS - Framework
	• Socket.io - helps use socket communication to make real time communication possible
	• Mongo DB along with Mongoose ; Server version: 3.4.10
	• Passport JS for authentication
	• Handlebars.js to make html templates
### Client:
	• HTML5, CSS3, Twitter bootstrap and Font awesome for the UI
	• Javascript utilities for client-side logic:
	JQuery – library to support our client-side scripting in handlebars
	Lodash – used for math functions
	Moment.js – handles the timings for our game when run
	Messenger.js – used for our network communication
	• Socket.io client

## Architecture
The Architecture consists of the following modules:
	• User authentication and registration process (/login & /register)
	• Real time multi-player gaming logic (See gaming logic section)
	• RESTful API (/api) for client server communication
	• Real time monitoring dashboard (/monitor)

<img src="https://github.com/RuchitaGarde/online-multiplayer-chess/blob/master/images/architecture.png" width="500px" height="350px"/>

## Installation Instructions
### Prerequisites:
1) Node JS
Download and install 8.9.2 LTS for Windows (x64) from https://nodejs.org/en/
2) Mongo DB
For this project we have installed MongoDB from the Community Center. Install mongodb-win32-x86_64-2008plus-ssl-3.4.10-signed (for Windows 64 bit). We will be running it on the default port (27017) and using the default database
chess_681.

### Steps to run the application
1) Start your mongoDB server and client:
	1) run command prompt as an administrator
		- Navigate to bin folder inside MongoDB and execute the command below:
		- `mongod.exe --dbpath "C:\Program Files\MongoDB\data\db"`
		Example: `C:\Program Files\MongoDB\Server\3.4\bin>mongod.exe --dbpath "C:\Program Files\MongoDB\data\db"`
	2) run command prompt as an administrator
		- Navigate to bin folder inside MongoDB and execute the command below:
		- `mongo.exe`
		Example: C:\Program Files\MongoDB\Server\3.4\bin>mongo.exe
2) Unzip the project folder
3) Run node.js command prompt
	- Navigate to the project folder
	Example: `C:\~\Chess681_ArunaRuchita>`
	- Run the below commands
		- `npm install`
		- `node app.js` OR `node .`
4) Open your browser and run the localhost https://localhost:3000/ to see the chess681 web app running.

## Playing instructions and game rules
This game can be played by multiple users, 2 users per game room. A user needs to first register using his username, email id and password. If he has already done so, he can login using his email id and password. User can also change his password through the accounts page.
If a user already exists in the database and he attempt to register again the application will not allow the user to register and will show a message at the bottom of the screen as shown below:

<img src="https://github.com/RuchitaGarde/online-multiplayer-chess/blob/master/images/instructions1.png" width="500px" height="350px"/>

Once logged in, the following is a general flow of the game:
1. Each player can create a game by sending a 'create-game' event to the server.
2. The server creates a new game and replies to the player with a randomly generated token for the game.
3. The player sends this token to other players and waits for them to join the game.
4. Others players join the game by sending a 'join-game' event to the server.
5. Once both players join the game, the server joins players sockets to the same socket.io room.
6. At this point, the game starts: each player can send one valid event (by chess logic) and then wait for the other player.
7. The move is broadcasted to the other player, and he will have a chance to play.
8. When the game is over, each player is notified and sockets leave the game room.
Please note that, if the first player leaves the game after the 2nd player has started the game, the game room will still keep its session. The 2nd player can then share the first player’s game room link with another player, and start playing the game.
A timer keeps track of the time each player gets to make a move. If a side does not make a move for 300 seconds, the other player is declared as winner. The player can also see all the game moves on the bottom of the application on the right hand side panel ‘Moves’.

<img src="https://github.com/RuchitaGarde/online-multiplayer-chess/blob/master/images/instructions2.png" width="500px" height="350px"/>

If either of the players leave, the other player automatically wins.
Game statistics: At any point in time, you can see how many games are currently being played, and how many players are online.

<img src="https://github.com/RuchitaGarde/online-multiplayer-chess/blob/master/images/instructions3.png" width="500px" height="350px"/>

A player also has the provision to change his password, and see when he was last active when is logs in and clicks on his own profile name.

<img src="https://github.com/RuchitaGarde/online-multiplayer-chess/blob/master/images/instructions4.png" width="500px" height="350px"/>

## Code structure and files description:
	• App.js: This file marks the starting point of the game. This launches the game on localhost at port 3000. This also has all the routes defined.
	• Package.json and packages-lock.json: These files have all the dependencies our game requires. Package.json instructs npm which dependencies packages it needs to install.
	• Views folder: This folder has all the handlebars files with .hbs extension which handles HTML templating for User Interface.
	• Gamepages folder: This folder contains all the javascript files witht .js extension. These files route all the REST API requests like get and post, to get data from user and send it to the database, or fetch data from database and display to the user.
	• Models folder: This folder contains mongoDB schemas for defining users and games.
	• Public > chessboardjs and chessjs folders: These folders contain files to design the chessboard, its look and feel, and the logic of the chess game. These are MIT licensed chess APIs. Thanks to [1] and [2] whose libraries, developed by MIT have the chess game logic upon which we have based our application.
	• Public > javascript chess681.js: This file has the logic and working of the app.
	• Public > bootstrap, fontawesome, lodash, messenger folders: These folders are other APIs and frameworks required.
	• Config > database.js: This file creates connection with the database.
	• Config > passport.js: This file handles user authentication.
	• Config > config.js: This file handles socket connection. It creates sessions for games, handles new connections and disconnections.
	• Config > util.js: This file creates salt hashes to store passwords.
	• Certificates folder: This folder contains certificates generated for SSL.

## Bibliography
1) http://chessboardjs.com/
2) https://github.com/jhlywa/chess.js
3) Course Work slides – Dr David A Wheeler
4) https://github.com/coreinfrastructure/best-practices-badge/blob/master/doc/security.md
5) https://justin.kelly.org.au/how-to-create-a-self-sign-ssl-cert-with-no-pa/
6) https://blog.risingstack.com/node-hero-node-js-authentication-passport-js/
7) https://www.techopedia.com/definition/27388/database-authentication
8) https://fosterelli.co/dangerous-use-of-express-body-parser
9) https://github.com/expressjs/body-parser#express-route-specific
10) https://docs.mongodb.com/manual/tutorial/configure-ssl/

I would like to specially thank (Aruna Sindhuja Peri)[https://www.linkedin.com/in/aruna-sindhuja-peri-892a9711a/] for her contribution to this project.