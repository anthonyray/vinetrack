var FFmpeg = require('fluent-ffmpeg');
var request = require('request');
var fs = require('fs');


var remoteVideoStream = request.get(videoURL);
var localVideo = fs.createWriteStream('./tmp/mp4/local.mp4');


localVideo.on("finish",function(){
    console.log('Downloaded the video, now converting it to mp3');
    var command = new FFmpeg({ source: './tmp/mp4/local.mp4' })
    .withNoVideo()
    .withAudioCodec('libmp3lame')
    .toFormat('mp3')
    .on('error', function(err) {
            console.log('An error occurred: ' + err.message);
        })
    .on('end', function() {
            console.log('finished converting the video to mp3, now sending the file to echonest'); // Delete the file here
            
            fs.unlink('./tmp/mp4/local.mp4', function (err) {
              if (err) throw err;
              console.log("Deleted temp file")
            })

            //var audioStream = fs.createReadStream('./tmp/mp3/local.mp3');
            fs.readFile('./tmp/mp3/local.mp3', function(err,data){
                var data = data;
                if (err) throw err;
                var request = require('request')
                request(
                    { method: 'POST'
                    , url: 'http://developer.echonest.com/api/v4/track/upload?api_key=YZSOJU6RZKSXKA0ZM&filetype=mp3',
                    //, url : "http://requestb.in/1m18n6r1",
                    headers :{
                        'content-type' : 'application/octet-stream'
                    }, 

                    body : data
                    }
                  , function (error, response, body) {
                      if (error){
                        console.log("ERROR : ",error);
                      }
                      else {
                        var resp = JSON.parse(body);    
                        if (resp.response.status.message == 'Success') {
                            var song_id = resp.response.track.id;
                            console.log("Song Found : ",song_id);
                            setTimeout(function(){
                                request.get("http://developer.echonest.com/api/v4/track/profile?api_key=YZSOJU6RZKSXKA0ZM&format=json&id="+song_id+"&bucket=audio_summary",function(err,response,body){
                                if(err){
                                    console.log("Error finding the song, sorry...");
                                }
                                else {
                                    var info = JSON.parse(body);
                                    if (info.response.track.title && info.response.track.artist){
                                        console.log(info.response.track.title,"-",info.response.track.artist);
                                    }
                                    else
                                    {
                                        console.log('Error while retrieving the file')
                                    }
                                }
                            });
                            },3000);
                        }
                        else{
                            console.log("ERROR :", resp.response.status.message);
                        }
                      }
                    }
                  )
            });
        })
    .saveToFile('./tmp/mp3/local.mp3');

})


inputStream.pipe(localVideo);