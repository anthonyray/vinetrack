var expect = require("chai").expect;
var scrap = require("../lib/scrap.js");
 
describe("Scrap", function(){
	describe("#scrap()",function(){
		it("should scrap vine.co to retrieve the video URL from a CORRECT postId",function(done){
			var correctPostId = "MFFrOT7QLiY";
			
			scrap(correctPostId,function(err,videoURL){
				if (err)
					done(err);
				else {
					expect(videoURL).to.deep.equal("https://v.cdn.vine.co/r/videos/877B3011361095472209319063552_1f933987c63.3.1.mp4")
					done();
				}

			})
		})
		it("should throw an error if the URL is incorrect",function(done){
			var incorrectPostId = "qpipojdc";
			scrap(incorrectPostId,function(err,videoURL){
				expect(err).to.exist;
				expect(videoURL).to.not.exist;
				done();
			})
		})
	})
	
});