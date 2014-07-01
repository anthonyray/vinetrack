var request = require('request');
var cheerio = require('cheerio');

module.exports = function(postId,callback) {
	
	request.get("https://vine.co/v/" + postId,function(err,resp,body){
		if (err){
			callback(err)
		}
		else {
			
			var $ = cheerio.load(body);
			var URL = $("meta[property~='twitter:player:stream']").attr('content');
			if (URL) {
				var videoURL = URL.substr(0,URL.indexOf("?versionId="));
				callback(null,videoURL);
			}

			else {
				callback("Incorrect post URL")
			}
			
			
			
		}
	})
};
