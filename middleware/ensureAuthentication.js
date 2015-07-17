var db = require('../db')
	,User = db.model('User');

module.exports =  function(req, res, next) {
	var userId = req.headers['x-auth-token'];
	User.findById(userId, function(err, user){
		if(err) res.sendStatus(500);
		else if(!user) res.sendStatus(401);
		else if(user){
			next();
		}
	})
};