var gotadaa = require('./go-tadaa'),
  tadaa = require('tadaa');

var interval = 120000;
var up = 'up.ogg'; 
var down = 'down.ogg'; 
var zero = 'zero.ogg'; 
var release = 'release.ogg';
var audioPlayer = 'ogg123' 

var failuresGetValueOptions = {
  username: process.argv[2],
  password: process.argv[3],
  project: process.argv[4],
  url: process.argv[5]
}; 

tadaa.start(
    interval, 
    [{fn: tadaa.up, sound:up}, {fn: tadaa.down, sound:down}, {fn: tadaa.dropToZero, sound:zero}], 
    gotadaa.getNumberOfFailures, 
    failuresGetValueOptions, 
    audioPlayer);


var releasesGetValueOptions = {
  username: process.argv[2],
  password: process.argv[3],
  url: process.argv[5],
  project: process.argv[6],
}; 

tadaa.start(
    interval, 
    [{fn: tadaa.up, sound:release}], 
    gotadaa.getLastBuildNumber, 
    releasesGetValueOptions, 
    audioPlayer);