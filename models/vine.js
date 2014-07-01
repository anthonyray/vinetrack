var mongoose = require('mongoose');

var vinetrackSchema = mongoose.Schema({
	postId : String,
	videoURL : String,
	track : {
		echonest_Id : String,
		title : String,
		artist : String,
		checked : Number
	}
});

module.exports = mongoose.model('VineTrack',vinetrackSchema);