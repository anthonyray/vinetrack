var request = require('request');
var fs = require('fs');
var conf = require('../config.js');

function FromEchoNestId(vinetrack,callback) { 

	request.get("http://developer.echonest.com/api/v4/track/profile?api_key=" + conf.echoNestAPIKey+ "&format=json&id=" + vinetrack.track.echonest_Id + "&bucket=audio_summary" ,  function(err,response,body){
		
		if(err){
			callback(err);
		}
		else { // The request succeeded, make sure the status is complete
			var info = JSON.parse(body);
			
			if (info.response.track.status == "complete" && ( info.response.track.title && info.response.track.artist ) ) { // The song is fully analyzed and has returned a result
				vinetrack.track.artist = info.response.track.artist;
				vinetrack.track.title = info.response.track.title ;
				callback(null,vinetrack);
			}
			else {
				if (info.response.track.status == "complete") {
					vinetrack.track.title = '';
					vinetrack.track.artist = '';
					callback(null,vinetrack);
				}
				else {
					callback("An error happened");
				}
			}
		}
	});
	
};


function FromFile(vinetrack,callback) {

	fs.readFile('./tmp/mp3/' + vinetrack.postId + '.mp3' ,function(err,data){
		if (err) { // The file doesn't exists
			callback(err)
		}
		else { // The file exists
			var data = data;
			request(
				{ method: 'POST'
			    , url: 'http://developer.echonest.com/api/v4/track/upload?api_key='+conf.echoNestAPIKey+'&filetype=mp3',
			    headers :{
			    	'content-type' : 'application/octet-stream'
			   	}, 
			   	body : data
			    }
			  , function (error, response, body) {
			      if (error){
			      	callback(error);
			      }
			      else {
			      	var resp = JSON.parse(body);
					
			      	if (resp.response.track.status == "complete"){
			      		
			      		vinetrack.track.echonest_Id = resp.response.track.id;
			      		vinetrack.track.artist = resp.response.track.artist; 
			      		vinetrack.track.title = resp.response.track.title;
			      		fs.unlink('./tmp/mp3/' + vinetrack.postId + '.mp3' ,function(err){
			      			if (err)
			      				callback(err);
			      			else
			      				callback(null,vinetrack);
			      		});
			      		
			      	}
			      	else {
			      		
			      		vinetrack.track.echonest_Id = resp.response.track.id;
			      		setTimeout(function(){
			      			FromEchoNestId(vinetrack,function(err, track){
			      				if (err){
			      					callback(err);
			      				}
			      				else {
			      					callback(null,track);
			      				}
			      			});
			      		},2000);
			      		
			      	}

			     	}

			    }
			  )
		}
	})
};

exports.FromFile = FromFile;
exports.FromEchoNestId = FromEchoNestId;