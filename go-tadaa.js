var _ = require('underscore'),
request = require('request'),
S = require('string'),
xml2json = require('node-xml2json');

var gotadaa = {};

var lastChecked = 0;

gotadaa._getJson = function(username, password, url, done) {
  // console.log('Calling ' + url + ' with ' + username + ' : ' + password);
  var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
  request.get({
    url: url,
    headers: {
      "Authorization": auth
    }
  },
  function(error, response, body) {
    if (error) {
      console.error(error);
      return done(error);
    }

    var json = {};
    if(body) {
      json = xml2json.parser(body);
    }

    return done(null, json);
  });
}

gotadaa._getFailedProjects = function(allProjects, projectNameStartsWith, lastCheckTime) {
  // console.log(JSON.stringify(allProjects));
  var projects = _.values(allProjects)[0].project;
  var required = _.filter(projects, function(p) { return S(p.name).startsWith(projectNameStartsWith); });
  var changedSinceLastCheck = _.filter(required, function(p) { return Date.parse(p.lastbuildtime) > lastCheckTime });
  var failed = _.filter(changedSinceLastCheck, function(p) { return p.lastbuildstatus != 'Success'} );
  return failed;
};

gotadaa.getNumberOfFailures = function(options, done) {
  console.log('Checking Go server...')
  gotadaa._getJson(options.username, options.password, options.url, function(e, data) {
    var failed = gotadaa._getFailedProjects(data, options.project, lastChecked);
    lastChecked = new Date().getTime();
    console.log(failed.length + ' failing projects');
    done(e, failed.length);
  });
};

module.exports = gotadaa;

