module.exports = function(app){

	app.use(function(req, res, next){
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});

	app.use("/api/users", require('./routes/user'));
	app.use("/api/songs", require('./routes/song'));
}