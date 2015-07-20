/**
 * Created by avaneeshdesai on 7/19/15.
 */
var db = require('../db'),
	Song = db.model('Song');

var getSongs = function(res, location, distance, units){
	var loc = location.split(",");
	var b = bounds(loc[0], loc[1], distance, units);
	var b1, b2, b3, b4;
	if(b[0][0] > b[2][0]){
		b1 = b[2][0];
		b2 = b[0][0];
	}else{
		b1 = b[0][0];
		b2 = b[2][0];
	}

	if(b[1][1] > b[3][1]){
		b3 = b[3][1];
		b4 = b[1][1];
	}
	else{
		b3 = b[1][1];
		b4 = b[3][1];
	}

	Song.find({"latitude":{$gt: b1, $lt:b2}, "longitude":{$gt:b3, $lt:b4}}, function(err, songs){
		if(err){
			res.sendStatus(500);
		}else{
			res.send({"songs": songs});
		}
	});
};

module.exports = getSongs;

function bounds(latitude, longitude, distance, units){
	return [destination(latitude, longitude, 0, distance, units),
			destination(latitude, longitude, 90, distance, units),
			destination(latitude, longitude, 180, distance, units),
			destination(latitude, longitude, 270, distance, units)]
}

function destination(lat, lon, bearing, dist, units){
	var radius = units == "km" ? 3963.19 : 6378.137;
	var rLat = toRadians(lat);
	var rLon = toRadians(lon);
	var rBearing = toRadians(bearing);
	var rAngDist = distance /radius;
	var rLatB = Math.asin(Math.sin(rLat) * Math.cos(rAngDist) +
		Math.cos(rLat) * Math.sin(rAngDist) * Math.cos(rBearing));
	var rLonB = rLon + Math.atan2(Math.sin(rBearing) * Math.sin(rAngDist) * Math.cos(rLat),
			Math.cos(rAngDist) - Math.sin(rLat) * Math.sin(rLatB));

	return [rLatB, rLonB];
}


function toRadians(degrees){
	return degrees * Math.PI / 180;
}



