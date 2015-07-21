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
	Song.find({
		location: {
			$near: location,
			$maxDistance: 10
		}
	}, function(err, songs){
		if(err){
			res.sendStatus(500);
		}else{
			res.send({"songs": songs});
		}

	})
});

router.post('/', ensureAuth, function(req, res){
	var s = req.body;
	var loc = req.body.location.split(",");
	var song = {
		name: s.title,
		artist: s.artist,
		location: [loc[0], loc[1]],
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
	var userID = req.params.userId;
	Song.find({uploadedBy: userID}, function(err, songs){
		if(err){
			res.sendStatus(500);
		}else{
			res.send({'songs':songs});
		}
	});
});

router.get('/artist/:artistName', function(req, res){
	var artistName = req.params.artistName;
	Song.find({artist: new RegExp(artistName, "i")}, function(err, songs){
		if(err){
			res.sendStatus(500);
		}else{
			res.send({'songs':songs});
		}
	});
});

router.get('/genre/:genre', function(req, res){
	var genre = req.params.genre;
	Song.find({genre: genre}, function(err, songs){
		if(err){
			res.sendStatus(500);
		}else{
			res.send({'songs':songs});
		}
	});
});

router.get('/name/:songName', function(req, res){
	var songName = req.params.songName;
	Song.find({name: new RegExp(songName, "i")}, function(err, songs){
		if(err){
			res.sendStatus(500);
		}else{
			res.send({'songs':songs});
		}
	});
});