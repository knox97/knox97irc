// namespacing
var app = app || {};

app.userModel = Backbone.Model.extend({

	initialize: function() {

	},

	getNameColored: function() {
		var username = this.get('name');
		var url = `http://localhost:3000/api/getColoredName?name=${username}`;

		$.ajax({
			type: 'GET',
			url: url,
			dataType: 'JSON',
			success: function(data) {
				console.log(data);
				this.set('usernameColored', data.nameColored);
			},
			error: function(error) {
				console.error(error);
			}
		});
	}

});