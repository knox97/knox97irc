var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	usernameColored: [[String, String]],
	onConnect: String,
	onDisconnect: String
});

var User = mongoose.model('User', UserSchema);

module.exports = User;