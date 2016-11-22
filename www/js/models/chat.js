// app creation
var app = angular.module('ircChat', []);

app.run(function($rootScope) {
	$rootScope.user = '';
	$rootScope.nick = '';
	$rootScope.connect = '';
	$rootScope.disconnect = '';
	$rootScope.getCookie = function(_cookie) {
		var theCookie = '';
		var Cookies = document.cookie;
		console.log(Cookies);
		if (Cookies.match(/;/gi) != null) {
			Cookies
				.split(';')
				.forEach(function(cookie) {
					cookie = cookie.trim().split('=');
					if (cookie[0].trim() == _cookie) {
						theCookie = cookie[1];
					}
				});

		}
		else
			theCookie = Cookies.split('=')[1];
		console.log(theCookie);
		return theCookie;
	};

	$rootScope.parseNick = function(nickname) {
		var colors = nickname.match(/#[0-9ABCDEF]{6}/gi);

		var text = nickname.match(/#[0-9abcdef]{6}[A-Z0-9]+/gi)
			.map(function(word) {
				return word.substring(7,word.length);
			});

		var arr = [];

		colors.forEach(function(col, i) {
			arr.push([col, text[i]]);
		});

		return arr;
	};
});

app.controller('chat-users', function($scope, $timeout) {

});

app.controller('chat-input', function($scope, $rootScope) {


	$scope.sendMessage = function(text) {
		var nickname = $rootScope.getCookie('nick');
		nickname = $rootScope.parseNick(nickname);
		socket.emit('sendMessage', {message: text, nick: nickname});
	};

	$('#chat-io').keydown(function(e) {
		var key = e.keyCode || e.which;
		if (key == 13) {
			e.preventDefault();
			var text = $(this).val();
			$(this).val('');
			$scope.sendMessage(text);
		}
		
	});
});

app.controller('settings', function($scope, $http, $rootScope) {
	// /#[0-9abcdef]{6}[A-Z0-9]+/gi
	// matches all stuff like #50b200knox, #35353597
	// set input field of name from database
	$scope.nickname = $rootScope.nick;

	$scope.updateSettings = function() {
		console.log('Settings Updated');
	};

	$rootScope.formatNick = function(nick) {
		var formatedNick = '';

		nick.forEach(function(part) {
			formatedNick += part.join('');
		});

		return formatedNick;
	};

	$rootScope.getUserColor = function() {
		var nickname,
			username = $rootScope.user;

		if (username) {
			var url = `${httpURL}/api/getUserColor?user=${username}`;
			console.log(url);

			$http({
				method: 'GET',
				url: url
			})
			.then(function(res) {
				console.log(res);
				var formatedNick = '';
	 
				res.data.nickname
					.forEach(function(part) {
						formatedNick += part.join('');
					});

				console.log(formatedNick);
			}, function(res) {
				console.log(res);
			});
		}
		
	};

	$rootScope.setUserColor = function(nickname) {

	};
});

app.controller('login-sys', function($scope, $http, $rootScope, $timeout) {
	$scope.login = function() {
		var username = $('#login-user').val();
		var password = $('#login-pass').val();
		var returnMessage = 'Error, something went wrong';
		var isValid = true;

		var userCheck = username.replace(/[a-z0-9]/gi, '').length;
		var passCheck = password.replace(/[a-z0-9]/gi, '').length;

		if (userCheck || passCheck || username.length < 5 || password.length < 5) {
			returnMessage = 'Invalid username or password'
			isValid = false;
		}

		if (isValid) {
			var url = `${httpURL}/api/login`;
			var postBody = {
				username: username,
				password: password
			}

			$http({
				method: 'POST',
				url: url,
				data: postBody
			}).then(function successCallback(res) {
				res = res.data;
				var status = res.data;
				if (status == 'SUCCESS') {
					document.cookie = `user=${username}`;
					document.cookie = `nick=${$rootScope.formatNick(res.nick)}`;
					$rootScope.nick = $rootScope.formatNick(res.nick);
					$rootScope.user = res.user;
					$rootScope.connect = res.connect;
					$rootScope.disconnect = res.disconnect;
					_nick = $rootScope.formatNick(res.nick);
					_user = res.user;
					$('#chat-output').html('');
					socket.emit('newUserData', {
						nick: $rootScope.parseNick(_nick),
						user: _user,
						connect: res.connect,
						disconnect: res.disconnect
					});
					logSuccess(res.message);
					loading('show', 0, false);
					$timeout(function() {
						$('.window').css('visibility', 'hidden');
						$('.main').css('visibility', 'visible');
					}, 235);
					loading('hide', 1350);
				}
				else if (status == 'ERROR') {
					logError(res.message);
				}
				console.log(res);
			}, function errorCallback(res) {
				console.log(res);
			});
		}
		else if (!isValid) {
			logError(returnMessage);
		}


		

	};

	$scope.register = function() {
		var username = $('#register-user').val();
		var password = $('#register-pass').val();
		var password1 = $('#register-pass1').val();
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
			var url = `${httpURL}/api/register`;
			console.log(url);
			var postBody = {
				username: username,
				password: password,
				password1: password1
			}

			$http({
				method: 'POST',
				url: url,
				data: postBody
			}).then(function successCallback(res) {
				res = res.data;
				var status = res.data;
				if (status == 'SUCCESS') {
					document.cookie = `user=${username}`;
					document.cookie = `nick=${$rootScope.formatNick(res.nick)}`;
					$rootScope.nick = $rootScope.formatNick(res.nick);
					$rootScope.user = res.user;
					_nick = $rootScope.formatNick(res.nick);
					_user = res.user;
					$('#chat-output').html('');
					socket.emit('newUserData', {
						nick: $rootScope.parseNick(_nick),
						user: _user,
						connect: res.connect,
						disconnect: res.disconnect
					});
					logSuccess(res.message);
					loading('show');
					$timeout(function() {
						$('.window').css('visibility', 'hidden');
						$('.main').css('visibility', 'visible');
					}, 235);
					loading('hide', 1350);
				}
				else if (status == 'ERROR') {
					logError(res.message);
				}
				console.log(res);
			}, function errorCallback(res) {
				console.log(res);
			});
		}
		else if (!isValid) {
			logError(returnMessage);
		}


	}
});
