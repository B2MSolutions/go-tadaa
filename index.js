var _ = require('underscore'),
request = require('request'),
S = require('string'),
xml2json = require('node-xml2json');

var tadaago = {};

tadaago._getJson = function(username, password, url, done) {
  var auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
  request.get({
    url: url,
    headers: {
      "Authorization": auth
    }
  },
  function(error, response, body) {
    if (error) {
      return done(error);
    }

    var json = {};
    if(body) {
      json = xml2json.parser(body);
    }

    return done(null, json);
  });
};

tadaago._getFailedProjects = function(allProjects, projectNameStartsWith) {
  var projects = _.values(allProjects)[0].project;
  var required = _.filter(projects, function(p) { return S(p.name).startsWith(projectNameStartsWith); });
  var failed = _.filter(required, function(p) { return p.lastbuildstatus == 'Failure'; } );
  return failed;
};

tadaago._getLastBuildNumber = function(allProjects, projectName) {
  var projects = _.values(allProjects)[0].project;
  var required = _.filter(projects, function(p) { return p.name === projectName && p.lastbuildstatus === 'Success'; });
  if(required.length === 0) {
    return undefined;
  }

  return required[0].lastbuildlabel;
};

tadaago.getNumberOfFailures = function(options, done) {
  console.log('Checking Go server for build failures...');
  tadaago._getJson(options.username, options.password, options.url, function(e, data) {
    if(e) {
      console.error(e);    
      return done(null, null);
    }
    
    var failed = tadaago._getFailedProjects(data, options.project);
    console.log(failed.length + ' failing projects');
    return done(null, failed.length);
  });
};

tadaago.getLastBuildNumber = function(options, done) {
  console.log('Checking Go server for last build number...');
  tadaago._getJson(options.username, options.password, options.url, function(e, data) {
    if(e) {
      console.error(e);    
      return done(null, null);
    }

    var lastBuildNumber = tadaago._getLastBuildNumber(data, options.project);
    console.log('last build number was ' + lastBuildNumber);
    return done(null, lastBuildNumber);
  });
};

tadaago.getValue = function(options, done) {
  tadaago.getLastBuildNumber(options, done);
};

module.exports = tadaago;
