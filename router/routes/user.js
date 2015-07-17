var express = require('express')
	, bcrypt = require('bcrypt')
	, db = require('../../db')
	, User = db.model('User')
	, ensureAuth = require('../../middleware/ensureAuthentication')
	, router = express.Router();


router.post('/authenticate', function(req, res){
	var u = req.body.user;
	User.findOne({'email': u.email}, function(err, user){
		if(err){res.sendStatus(500);}
		else if(!user){
			//Sign-up
			var newUser = User(u);
			newUser.save(function(err){
				if(err){
					var code = err.code === 11000 ? 409 : 500;
					return res.sendStatus(code)
				}
				else {
					res.send({user: newUser.toClient()});
				}
			});
		}
		else{
			//Login
			user.comparePassword(u.password, function(isMatch){
				if(isMatch) return res.send({user: user.toClient()});
				else{
					res.sendStatus(401);
				}
			});
		}
	});
});


router.post('/addfav/:songId', ensureAuth, function(req, res){
	var songId = req.params.songId;
	var userId = req.headers['x-auth-token'];

	console.log(userId);
	User.findByIdAndUpdate(userId, {$addToSet: {favList: songId}}, function (err, user) {
		if (err)  res.sendStatus(500);
		else if(!user) res.sendStatus(404);
		else res.sendStatus(200);
	});
});


router.get('/:userId', function(req, res){
	var userId = req.params.userId;
	User.findById(userId, function(err, user){
		if(err) res.sendStatus(500);
		else if(!user) {
			res.sendStatus(404);
		}
		else{
			res.send({user: user});
		}
	});
});

module.exports = router;
