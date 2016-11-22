// list of users and settings
var isOpen = false


$(document).ready(function() {
	$('.main .users .show .show-button').on('click', function() {
		if (isOpen) {
			$('.main .users').css('right', '-200px');
			$('.main .users .show .show-button span').removeClass('glyphicon-menu-right');
			$('.main .users .show .show-button span').addClass('glyphicon-menu-left');
			isOpen = false;
		}
		else {
			$('.main .users').css('right', '0px');
			$('.main .users .show .show-button span').removeClass('glyphicon-menu-left');
			$('.main .users .show .show-button span').addClass('glyphicon-menu-right');
			isOpen = true;
		}
	});
});

