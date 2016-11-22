// logError() logSuccess()
console.log('%c>_', 'color: #50b200; font-weight: bold; font-size: 1.5em; line-height: 60px', '     \'logSystem\' by knox97 loaded.');

function logError(text) {
	$('.log').text(text);
	$('.log').css({
		'border': '2px solid #990000',
		'top': '2%'
	});

	setTimeout(function() {
		var logY = $('.log').height();
		logY *= 3;
		$('.log').css({
			'top': -logY + 'px'
		});
	}, 1500);
}

function logSuccess(text) {
	$('.log').text(text);
	$('.log').css({
		'border': '2px solid #50b200',
		'top': '2%'
	});

	setTimeout(function() {
		var logY = $('.log').height();
		logY *= 3;
		$('.log').css({
			'top': -logY + 'px'
		});
	}, 1500);
}