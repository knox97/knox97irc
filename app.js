var express = require('express');
var loginSystem = require('./routes/loginSystem.js');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var chatSystem = require('./server/chat-server.js');
var app = express();
//var io = require('socket.io')();

//connecting to database
mongoose.connect('mongodb://<user>:<pass>@ds157247.mlab.com:57247/irc');

var api = require('./routes/api.js');

//middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//setting up API for loginSystem
app.use('/api', api);
app.use(express.static('./www'));

app.set('PORT', 3000);

var port = app.get('PORT') || 3000;

chatSystem(app);

/*
app.listen(port, function() {
	console.log(`Server running on ${port}`);
});*/
