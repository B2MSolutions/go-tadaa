var gotadaa = require('./go-tadaa'),
  tadaa = require('tadaa');

var interval = 60000;
var up = 'up.wav'; 
var down = 'down.wav'; 
var audioPlayer = 'aplay' 

var getValueOptions = {
  username: process.argv[2],
  password: process.argv[3],
  project: process.argv[4],
  url: process.argv[5]
}; 

tadaa.start(interval, up, down, gotadaa.getNumberOfFailures, getValueOptions, audioPlayer);