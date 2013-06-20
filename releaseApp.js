var gotadaa = require('./go-tadaa'),
  tadaa = require('tadaa');

var interval = 120000;
var release = 'release.ogg';
var audioPlayer = 'ogg123' 

var releasesGetValueOptions = {
  username: process.argv[2],
  password: process.argv[3],
  project: process.argv[4],
  url: process.argv[5]
}; 

tadaa.start(
    interval, 
    [{fn: tadaa.up, sound:release}], 
    gotadaa.getLastBuildNumber, 
    releasesGetValueOptions, 
    audioPlayer);