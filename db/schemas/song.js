var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var songSchema = new Schema({
    name: String,
    artist:String,
    latitude: Number,
    longitude: Number,
    genre: String,
    uploadedOn: Number,
	path: String,
    uploadedBy: String,
    fav_count:Number
});

songSchema.methods.toClient = function(){
	var song = {};
	song.id = this._id;
	song.uploadedOn = this.uploadedOn;
	song.name = this.name;
	song.artist = this.artist;
	song.genre = this.genre;
	return song;
}

module.exports = songSchema;