var express = require('express'),
	multer  = require('multer'),
	bodyParser = require('body-parser'),
	app = express();

app.use(multer({'dest':'./songs'}));
app.use(bodyParser.json());
app.use(express.static(__dirname+ '/songs'));
var router = require('./router')(app);
var server = app.listen(8000);

module.exports = server;