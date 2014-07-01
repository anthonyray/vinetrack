var FFmpeg = require('fluent-ffmpeg');
var request = require('request');
var fs = require('fs');


module.exports = function(vinetrack , callback){
    var remoteVideoStream = request.get(vinetrack.videoURL);
    var localVideoStream = fs.createWriteStream('./tmp/mp4/' + vinetrack.postId + '.mp4'); // Temp file

    localVideoStream.on("finish", function(){

        var command = new FFmpeg({ source : './tmp/mp4/' + vinetrack.postId + '.mp4' })
            .withNoVideo()
            .withAudioCodec('libmp3lame')
            .toFormat('mp3')
            .saveToFile('./tmp/mp3/' + vinetrack.postId + '.mp3')
            .on('error', function(error){
                callback(error);
            })
            .on('end',function(){

                fs.unlink('./tmp/mp4/' + vinetrack.postId + '.mp4', function(err){
                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(null,{ conversion : true});
                    }
                });
            })
        });

    remoteVideoStream.pipe(localVideoStream);

};

