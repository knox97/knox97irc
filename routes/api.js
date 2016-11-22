var User = require('../models/user.js');
var express = require('express');
var router = express.Router();

router.post('/login', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var returnMessage = 'Error, something went wrong';
	var isValid = true;

	var userCheck = username.replace(/[a-z0-9]/gi, '').length;
	var passCheck = password.replace(/[a-z0-9]/gi, '').length;

	if (userCheck || passCheck || username.length < 5 || password.length < 5) {
		returnMessage = 'Invalid username or password'
		isValid = false;
	}

	if (isValid) {
		// check if exists
		// true: createUser false: return user exists
		User.findOne({username: username}, 'username password usernameColored onConnect onDisconnect', function(err, user) {
			if (err) throw err;
			if (user) {
				if (user.password == password) {
					res.json({
						data: 'SUCCESS',
						message: 'Successfuly logged in',
						user: user.username,
						nick: user.usernameColored,
						connect: user.onConnect,
						disconnect: user.onDisconnect
					});
				}
				else {
					res.json({data: 'ERROR', message: 'Wrong username or password'});
				}
			}
			else {
				res.json({data: 'ERROR', message: 'User doesn\'t exist'});
			}
		});
	}
	else if (!isValid) {
		res.json({data: 'ERROR', message: returnMessage});
	}
});

router.post('/register', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var password1 = req.body.password1;
	var returnMessage = 'Error, something went wrong';
	var isValid = true;

	var userCheck = username.replace(/[a-z0-9]/gi, '').length;
	var passCheck = password.replace(/[a-z0-9]/gi, '').length;

	if (userCheck || passCheck || username.length < 5 || password.length < 5) {
		returnMessage = 'Invalid username or password'
		isValid = false;
	}
	else if (password !== password1) {
		returnMessage = 'Passwords have to match';
		isValid = false;
	}

	if (isValid) {
		// check if exists
		// true: createUser false: return user exists
		User.findOne({username: username}, function(err, user) {
			if (err) throw err;
			console.log(user);
			if (user) {
				res.json({data: 'ERROR', message: 'User already exists'});
			}
			else {
				var newUser = new User({
					username: username,
					password: password,
					usernameColored: [['#FFFFFF', username]],
					onConnect: '',
					onDisconnect: ''
				});

				newUser.save(function(err, newUser) {
					if (err) throw err;
					res.json({
						data: 'SUCCESS',
						message: 'Successfuly registered',
						nick: newUser.usernameColored,
						user: newUser.username,
						connect: newUser.onConnect,
						disconnect: newUser.onDisconnect
					});
				});
			}
		});
	}
	else if (!isValid) {
		res.json({data: 'ERROR', message: returnMessage});
	}
});

router.get('/getUserColor', function(req, res) {
	var username = req.query.user;

	console.log(username);
});

router.post('/updateSettings', function(req, res) {
	var username = req.body.user;
	var nickname = req.body.nick;
	var connect = req.body.con;
	var disconnect = req.body.dis;
	var isValid = true;

	console.log(req.body);
	console.log('User:', username);
	console.log('Nick:', nickname);
	console.log('Connect:', connect);
	console.log('Disconnect', disconnect);

	var checkNick = nickname.replace(/#[0-9abcdef]{6}[A-Z0-9]+/gi, '').length;
	var onlyNick = nickname.replace(/#[0-9abcdef]{6}/gi, '');

	console.log(checkNick, onlyNick);
	if (checkNick > 0) {
		res.json({data: 'ERROR', message: 'Invalid form'});
		isValid = false;
	}
	else if (onlyNick != username) {
		res.json({data: 'ERROR', message: 'You can\'t change your nick, only colors'});
		isValid = false;
	}

	if (isValid) {
		// make it [col, text] format
		var colors = nickname.match(/#[0-9ABCDEF]{6}/gi);

		var text = nickname.match(/#[0-9abcdef]{6}[A-Z0-9]+/gi)
			.map(function(word) {
				return word.substring(7,word.length);
			});

		var arr = [];

		colors.forEach(function(col, i) {
			arr.push([col, text[i]]);
		});

		nickname = arr;
		connect = connect.replace(/\+/gi, ' ');
		disconnect = disconnect.replace(/\+/gi, ' ');

		User.findOne({username: username}, function(err, user) {
			if (err) throw err;
			if (user) {
				user.usernameColored = nickname;
				user.onConnect = connect;
				user.onDisconnect = disconnect;

				user.save(function(err, updatedUser) {
					if (err) throw err;
					if (updatedUser) {
						res.json({data: 'SUCCESS', message: 'Settings saved'});
						// TODO
						// add nick cookie and on login set global vars for user and nick
						// when user presses enter display message date/nickname/message
						// you already have created the template
						// after that add socket io and figure out how to update everyones
						// user list on connect and disconnect of each user
						// and create a collection called chat-users
						// where there will only be one document which will have
						// an array called online where only names will be stored
						// which you get from cookie or global var user
					}
				});
			}
		});
	}
});

module.exports = router;
