var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
	name: String,
	location: String,
	email: {type:String, unique:true},
	password: String,
	favList: {type: [String], default: []}
});

userSchema.pre('save', function(next){
	var myThis = this;
	console.log(this);
	bcrypt.hash(this.password, 8, function(err, hash){
		myThis.password = hash;
		next();
	});
});

userSchema.methods.toClient = function(){
	var user = {};
	user.id = this.id;
	user.name = this.name;
	return user;
};

userSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
		if (err) cb(false);
		cb(isMatch);
	});
};

module.exports = userSchema;