var gotadaa = require('./go-tadaa'),
  tadaa = require('tadaa');

var interval = 120000;

var releasesGetValueOptions = {
  username: process.argv[2],
  password: process.argv[3],
  project: process.argv[4],
  url: process.argv[5]
}; 

var sound = process.argv[6] || 'release.ogg';
var player = process.argv[7] || 'ogg123';
  
tadaa.start(
    interval, 
    [{fn: tadaa.up, sound:sound}], 
    gotadaa.getLastBuildNumber, 
    releasesGetValueOptions, 
    player);