// namespacing
var app = app || {};

app.userCollection = Backbone.Collection.extend({
	model: app.userModel
});