var express = require('express'),
	multer  = require('multer'),
	app = express();

app.use(multer({'dest':'./songs'}));
var router = require('./router')(app);
var server = app.listen(8000);

module.exports = server;