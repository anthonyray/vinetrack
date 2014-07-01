var express = require('express');
var router = express.Router();

var vineTrack = require('../models/vine');

var scrap = require('../lib/scrap');
var retrieve = require('../lib/retrieve');

router.get('/v/:postId', function(req, res) {
	
	vineTrack.findOne({ postId : req.params.postId },function(err,vine){
		if (err)
			return 	console.error(err)
		else {
			if (!vine) // The vine is not in the database, tell the client the process chain should be initiated
				res.json({analyzed : false});
			
			else {
				res.json({analyzed : true, vinetrack : vine});
			} // The vine is in the Database, send the information to the client 
				
		}
	});
});

// Task 1 : Tested
router.post('/scrap/:postId',function(req,res){
	vineTrack.findOne({postId : req.params.postId},function(err,vine){
		if (err)
			res.json({sucess : false, error : err});
		else { // If there is no error
			if (vine) { // If the vine is in the database, send it to the client
				res.json({success : true, vinetrack : vine });
			} 
			else { // The vine is not in the database, scrap the videoURL from the postId

				scrap( req.params.postId ,function( err , videoURL ){
					if (err)
						res.json({success : false, error : err});
					else {
						var vine = new  vineTrack({postId : req.params.postId, videoURL : videoURL});
						vine.save(function(err,vine){
							if (err)
								res.json({success :false, error : err});
							else {
								res.json({success : true, vinetrack : vine });
							}
						})
						
					}
				})
			}
		}
	})

});

// Task 2 : not thoroughly tested
router.post('/rtv/:postId',function(req,res){
	vineTrack.findOne({postId : req.params.postId},function(err,vine){
		if (err)
			res.json({sucess : false, error : err});
		else {

			if (vine) { // If the vine is in the database, download it and convert it to MP3
				retrieve(vine,function(err,status){
					if (err) // If an error happened while downloading/converting the file
						res.json({ success : false, error : err});

					else { // If the download & conversion went well
						res.json({ sucess : true, vinetrack : vine})
					}
				})
			}

			else { // The vine is not in the database, do not process it. 
				res.json({sucess : false, error : "The vine is not in the database"});
			}

		}
	});

});

module.exports = router;
