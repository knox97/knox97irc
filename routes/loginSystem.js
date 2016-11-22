var express = require('express');
var router = express.Router();

router.get('/login', function(req, res) {
	console.dir(req.params);
});

router.get('/register', function(req, res) {
	console.dir(req.params);
});

module.exports = router;