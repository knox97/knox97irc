// initial script run on the page


function adjustSizes(callback) {
	var screenW = $(document).width();
	var screenY = $(document).height();
	var chatWidth = screenW - 50;

	$('.main .chat').width(chatWidth + 'px');
	$('.main .chat .output').css('width', chatWidth + 'px');
	$('.main .chat .input').css('width', chatWidth + 'px');

	var usersShow = screenY - 100;
	usersShow /= 2;

	$('.main .users .show .show-button').css('padding', usersShow + 'px 0px');

	var chatOutput = $(document).height();
	chatOutput -= 80;
	$('.main .chat .output').css('height', chatOutput + 'px');
	if (callback)
		callback();
}

$(document).ready(function() {
	//loading('show');
	adjustSizes(function() {
		//loading('hide');
	});

	$(window).on('resize', function() {
		adjustSizes();
	});

});
