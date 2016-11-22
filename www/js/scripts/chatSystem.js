console.log('%c>_', 'color: #50b200; font-weight: bold; font-size: 1.5em; line-height: 60px', '     \'chatSystem\' by knox97 loaded.');

var users = [];

var socket = io.connect(httpURL);
/*socket.on('news', function (data) {
	console.log(data);
	socket.emit('my other event', { my: 'data' });
});*/

//socket.emit('newUserData', {nick: _nick, user: _user});

socket.on('updateOnlineUsers', function(data) {
	console.log('I recevied it!', data);
	data.onlineUsers.forEach(function(user) {
		var userIndex = users.indexOf(data.user);
		if (userIndex < 0 && data.state == 'joined') {
			users.push(data.user);
		}
		if (userIndex >= 0 && data.state == 'left') {
			users.splice(userIndex, 1);

		}
		
	});

	console.log(users);
	switch(data.state) {
		case 'left':
			removeFromChatUsers(`chat-user-${data.user}`);
			break;
		case 'joined':
			$('.online-users').append(`<div id="chat-user-${data.user}" class="user">${data.user}</div>`);
			break;
	}

	addMessageInfo(false, data.nick, data.message);
});

socket.on('init-users', function(data) {
	$('.online-users').html('');
	data.onlineUsers.forEach(function(user) {
		$('.online-users').append(`<div id="chat-user-${user}" class="user">${user}</div>`);
	});
});

socket.on('newMessage', function(data) {
	addMessage(false, data.nick, data.message);
});



function addMessage(time, nick, text) {
	var html = `<div class="message">
						<p>
						<span class="time">12:35 PM</span>
						<span class="user">`;

	nick.forEach(function(part) {
		html += `<span style="color: ${part[0]};">${part[1]}</span>`;
	});
						
	html += `:</span>${text}</p></div>`;
	$('#chat-output').append(html);
	$("#chat-output").scrollTop($('#chat-output').height());
}

function addMessageInfo(time, nick, text) {
	var html = `<div class="message">
						<p>
						<span class="time">12:35 PM</span>
						<span class="user">`;

	nick.forEach(function(part) {
		html += `<span style="color: #BBB;">${part[1]}</span>`;
	});
						
	if (text) {
		html += `</span><em style="color: #BBB;">${text}</em></p></div>`;
		$('#chat-output').append(html);
		$("#chat-output").scrollTop($('#chat-output').height());
	}
}

function removeFromChatUsers(id) {
	$(`#${id}`).remove();
}