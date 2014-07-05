var expect = require("chai").expect;
var analyze = require("../lib/analyze.js");
var request = require('request')
var fs = require('fs');

describe("Analyze", function(){
	describe("#FromEchoNestId",function(){
		it("should return a vinetrack with properties artist, title, echonest_Id from a valid echonest_Id",function(done){
			
			var correctVinetrack = {
				postId : "stub",
				videoURL : "stub",
				track : {
					echonest_Id : "TREMKIS146F6C7515E", // Correct echonest_Id
					checked : 1
				}
			}

			analyze.FromEchoNestId(correctVinetrack, function(err,vinetrack){
				if (err){
					done(err)
				}
				else {
					expect(vinetrack).to.have.deep.property('track.title',"Geekin’");
					expect(vinetrack).to.have.deep.property('track.artist',"will.i.am");
					done();
				}

			});
		})

		it("should return a vinetrack with properties artist, title empty and echonest_Id from a correct echonest_Id but not recognized by echonest", function(done){

			var correctVinetrack = {
				postId : "stub",
				videoURL : "stub",
				track : {
					echonest_Id : "TRMCPCD146F6C9F3B2", // Correct echonest_Id, but not recognized by echonest
					checked : 1
				}
			}

			analyze.FromEchoNestId(correctVinetrack,function(err,vinetrack) {
				if(err){
					done(err)
				}
				else {
					expect(vinetrack).to.have.deep.property('track.title','');
					expect(vinetrack).to.have.deep.property('track.artist','');
					done();
				}
			});
		})
	});

	describe("#FromFile()", function(){
		it("should not work if the file is absent",function(done){
			this.timeout(15000)
			var correctVineTrack = {
				postId : "MT6he64561Z5AZ1",
				videoURL : "https://v.cdn.vine.co/r/videos/99F59EB24B1091676846640467968_1a6bd3af978.3.4.mp4",
				track : {
					echonest_Id : "TREMKIS146F6C7515E", // Correct echonest_Id
					checked : 1
				}
			}

			analyze.FromFile(correctVineTrack, function(err,vinetrack){
				expect(err).to.exists
				done();
			});
		});
		
		it("should work if the file is present", function(done){
			this.timeout(15000)
			var correctVineTrack = {
				postId : "MT6he6Z5AZ1",
				videoURL : "https://v.cdn.vine.co/r/videos/99F59EB24B1091676846640467968_1a6bd3af978.3.4.mp4",
				track : {
					echonest_Id : "TREMKIS146F6C7515E", // Correct echonest_Id
					checked : 1
				}
			}

			analyze.FromFile(correctVineTrack,function(err,vinetrack) {
				expect(err).to.be.null
				done();
			})

		});

		it("should correctly retrieve the information from a tested MP3", function(done){
			this.timeout(15000)
			var correctVineTrack = {
				postId : "MT6he6Z5AZ1",
				videoURL : "https://v.cdn.vine.co/r/videos/99F59EB24B1091676846640467968_1a6bd3af978.3.4.mp4",
				track : {
					echonest_Id : "TREMKIS146F6C7515E", // Correct echonest_Id
					checked : 1
				}
			}

			analyze.FromFile(correctVineTrack,function(err,vinetrack){
				if (err)
					done(err);
				else {
					expect(vinetrack).to.have.deep.property('track.title','Just Girly Things');
					expect(vinetrack).to.have.deep.property('track.artist','Dawin');
					done();
				}

			});
		});
		it("should send empty information from an invalid MP3")
		it("should call FromEchoNest if the response status is pending");

	});
	
});