var express = require('express')
	, db = require('../../db')
	, Song = db.model('Song')
	, ensureAuth = require('../../middleware/ensureAuthentication')
	, busboy = require('connect-busboy')
	, fs = require('fs')
	, locationRec = require('../../middleware/locationRecommendation')
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

router.get('/stream/:songId', function(req, res){
	var songId = req.params.songId;
	Song.findById(songId, function(err, song){
		if(err) res.sendStatus(500);
		else{
			var path = song.path;
			path =  "./songs/" + path;
			var stream = fs.createReadStream(path);
			stream.on('error', function(){ console.log("Error while opening read stream to file"+ path); });
			stream.pipe(res);
		}
	})
});


router.get('/location/:location', ensureAuth, function(req, res){
	var loc = req.params.location;
	var location = loc.split(",");
	latitude = location[0];
	longitude = location[1];
	locationRec(res, latitude, longitude, 100, "mi");
});

router.post('/', ensureAuth, function(req, res){
	console.log(req);
	var s = req.body;
	var loc = req.body.location.split(",");
	var song = {
		name: s.title,
		artist: s.artist,
		latitude: loc[0],
		longitude: loc[1],
		genre: s.genre,
		uploadedOn: Math.round((new Date()).getTime() / 1000),
		path: req.files.song.name,
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