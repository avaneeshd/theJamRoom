var mongoose = require('mongoose'),
	userSchema =  require('./schemas/user'),
	songSchema = require('./schemas/song');

var db = mongoose.createConnection('127.0.0.1', 'the_jam_room', 27017);
db.model('User', userSchema);
db.model('Song', songSchema);

module.exports = db;