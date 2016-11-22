
module.exports = function(app) {
	var server = require('http').Server(app);
	var io = require('socket.io')(server);
	var db = require('../models/online-users.js');
	var dbName = 'online-users';
	var username = ''

	var port = process.env.PORT || 3000;
	console.log(`Server is running. [${port}]`);
	server.listen(port);

	io.on('connection', function (socket) {
		var nick = '';
		var user = '';
		var disconnect = '';

		socket.on('newUserData', function (data) {
			user = data.user;
			nick = data.nick;
			console.log('newUserData', user, nick);
			db.findOne({name: dbName}, 'name users', function(err, database) {
				if (err) throw err;
				console.log(database);
				if (database.users.indexOf(user) < 0) {
					database.users.push(user);
					database.save(function(err, databaseUpdated) {
						disconnect = data.disconnect;
						io.emit('updateOnlineUsers', {onlineUsers: databaseUpdated.users, user: user, nick: nick, message: data.connect + ' [JOINED]', state: 'joined'});
						socket.emit('init-users', {onlineUsers: databaseUpdated.users});
					});
				}
			});			
		});

		socket.on('sendMessage', function(data) {
			console.log(data);
			io.emit('newMessage', {nick: data.nick, message: data.message});
		});

		socket.on('disconnect', function() {
			console.log('Disconnect:', user, nick);
			db.findOne({name: dbName}, 'name users', function(err, database) {
				if (err) throw err;
				console.log(database);
				var userIndex = database.users.indexOf(user);
				console.log(userIndex);
				if (userIndex >= 0) {
					database.users.splice(userIndex, 1);
					console.log(database);
					database.save(function(err, databaseUpdated) {
						io.emit('updateOnlineUsers', {onlineUsers: databaseUpdated.users, user: user, nick: nick, message: disconnect + ' [LEFT]', state: 'left'});
					});
				}
			});
		});
	});
}


