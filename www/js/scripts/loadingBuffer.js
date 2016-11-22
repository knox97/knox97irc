


function loading(state, time, showWindow) {
	if (showWindow)
		setTimeout(function() {
			$('.window').css('visibility', 'visible');
		}, 350);
	var buffer = function() {
		if (state == 'show') {
			//top:0 from -100%
			$('#loadingBuffer').css('top', '0');
		}
		else if (state == 'hide') {
			//top:-100% from 0
			$('#loadingBuffer').css('top', '-100%');
		}
	}

	if (time)
		setTimeout(function() {
			buffer();
		}, time);
	else
		buffer();
}

