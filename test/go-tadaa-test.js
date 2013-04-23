var assert = require('assert'),
  gotadaa = require('../go-tadaa'),
  request = require('request'),
  sinon = require('sinon');

describe('go-tadaa', function() {
  describe('#_getJson()', function() {

    beforeEach(function() {
      sinon.stub(console, 'error');
    });

    afterEach(function() {
      console.error.restore();
      request.get.restore();
    });

    it('should call request with correct values', function(done) {
      sinon.stub(request, 'get').yields();
      gotadaa._getJson('USER', 'PASSWORD', 'URL', function(e, json) {
        assert(request.get.calledOnce);
        var auth = "Basic " + new Buffer('USER:PASSWORD').toString("base64");
        assert.deepEqual(request.get.args[0][0], {
          url: 'URL',
          headers: {
            "Authorization": auth
          }
        });
        done(e);
      });
    });

    it('should return correct json', function(done) {
      var xml = '<Projects><Project name="NAME" lastBuildStatus="SUCCESS" lastBuildTime="2013-03-22T15:31:43"/><Project name="NAME2" lastBuildStatus="SUCCESS" lastBuildTime="2013-03-22T15:31:42"/></Projects>';
      sinon.stub(request, 'get').yields(null, null, xml);
      gotadaa._getJson('USER', 'PASSWORD', 'URL', function(e, json) {
        var expectedJson = {
          projects: {
            project: [{
              name: "NAME",
              lastbuildstatus: "SUCCESS",
              lastbuildtime: "2013-03-22T15:31:43"
            }, {
              name: "NAME2",
              lastbuildstatus: "SUCCESS",
              lastbuildtime: "2013-03-22T15:31:42"
            }]
          }
        };
        assert.deepEqual(json, expectedJson);
        done(e);
      });
    });

    it('should return error if request errors', function() {
      sinon.stub(request, 'get').yields('ERROR');
      gotadaa._getJson('USER', 'PASSWORD', 'URL', function(e) {
        assert.equal(e, 'ERROR');
      });
    });
  });

  describe('#_getFailedProjects()', function() {
    beforeEach(function() {
      sinon.stub(console, 'error');
    });

    afterEach(function() {
      console.error.restore();
    });

    it('should return failed projects', function() {
      var projects = {
        projects: {
          project: [{
            name: "proj1",
            lastbuildtime: "2013-03-22T15:33:11",
            lastbuildstatus: "Failed"
          }, {
            name: "proj2",
            lastbuildtime: "2013-03-22T15:33:11",
            lastbuildstatus: "Success"
          }]
        }
      };

      var result = gotadaa._getFailedProjects(projects, 'proj', 0);
      assert.equal(result.length, 1);
    });

    it('should return all projects regardless of last built time', function() {
      var projects = {
        projects: {
          project: [{
            name: "proj1",
            lastbuildtime: "2013-03-22T15:33:11",
            lastbuildstatus: "Failed"
          }, {
            name: "proj2",
            lastbuildtime: "2013-03-22T15:42:11",
            lastbuildstatus: "Failed"
          }]
        }
      };

      var result = gotadaa._getFailedProjects(projects, 'proj', 1363966391001);
      assert.equal(result.length, 2);
    });

    it('should only return projects starting with correct name', function() {
      var projects = {
        projects: {
          project: [{
            name: "proj1",
            lastbuildtime: "2013-03-22T15:33:11",
            lastbuildstatus: "Failed"
          }, {
            name: "notproj2",
            lastbuildtime: "2013-03-22T15:42:11",
            lastbuildstatus: "Failed"
          }]
        }
      };

      var result = gotadaa._getFailedProjects(projects, 'proj', 0);
      assert.equal(result.length, 1);
    });
  });

  describe('#getNumberOfFailures()', function() {
    beforeEach(function() {
      sinon.stub(console, 'error');
      sinon.stub(console, 'log');
    });

    afterEach(function() {
      console.error.restore();
      console.log.restore();
      request.get.restore();
    });

    it('should return correct number of failed projects', function(done) {
      var xml = '<Projects><Project name="PROJECT1" lastBuildStatus="Success" lastBuildTime="2013-03-22T15:31:43"/><Project name="PROJECT2" lastBuildStatus="Fail" lastBuildTime="2013-03-22T15:31:42"/></Projects>';
      sinon.stub(request, 'get').yields(null, null, xml);

      gotadaa.getNumberOfFailures({ username: 'USER', password: 'PASSWORD', url: 'URL', project: 'PROJECT'}, function(e, result) {
        assert.equal(result, 1);
        done();
      });
    });
  });
});