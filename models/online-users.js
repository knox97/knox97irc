var mongoose = require('mongoose');

var OnlineUsersSchema = new mongoose.Schema({
		name: String,
		users: [String]
	},
	{
		collection: 'online-users'
	});

var OnlineUsers = mongoose.model('OnlineUsers', OnlineUsersSchema);

module.exports = OnlineUsers;