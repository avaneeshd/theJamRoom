var express = require('express')
	, db = require('../../db')
	, Song = db.model('Song')
	, ensureAuth = require('../../middleware/ensureAuthentication')
	, busboy = require('connect-busboy')
	, fs = require('fs')
	, router = express.Router();

module.exports = router;

router.get('/', ensureAuth, function(req, res){
	Song.find({}, function(err, songs){
		if(err) res.sendStatus(500);
		else{
			res.send({'songs': songs})
		}
	});
});

router.get('/:songId', ensureAuth, function(req, res){
	var songId = req.params.songId;
	Song.findById(songId, function(err, song){
		if(err) res.sendStatus(404);
		else{
			res.send({'song':song});
		}
	});
});

router.get('/location/:location', ensureAuth, function(req, res){
	var loc = req.params.location;
	Song.find({}, function(err, songs){
		if(err) res.sendStatus(500);
		else{
			res.send({'songs': songs})
		}
	});
});

router.post('/', ensureAuth, function(req, res){
	console.log(req);
	var s = req.body;
	var location = req.location.split(",");
	var song = {
		name: s.title,
		artist: s.artist,
		latitude: location[0],
		longitude: location[1],
		genre: s.genre,
		uploadedOn: s.uploadedOn,
		path: req.files.song.path,
		uploadedBy: req.headers['x-auth-token'],
		fav_count: 0
	};

	var newSong = Song(song);
	newSong.save(function(err){
		if(err) res.sendStatus(500);
		else{
			res.sendStatus(200);
		}
	});
});


router.get('/user/:userId', function(req, res){

});

router.get('/artist/:artistName', function(req, res){

});

router.get('/genre/:genreName', function(req, res){

});

router.get('/name/:songName', function(req, res){

});