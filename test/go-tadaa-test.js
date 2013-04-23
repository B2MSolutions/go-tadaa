var assert = require('assert'),
  gotadaa = require('../go-tadaa'),
  request = require('request'),
  sinon = require('sinon');

  describe('go-tadaa', function() {
    describe('#_getJson()', function() {
      beforeEach(function() {
      });

      afterEach(function() {
        request.get.restore();
      });

      it('should call request with correct values', function(done) {
        sinon.stub(request, 'get').yields();
        gotadaa._getJson('USER', 'PASSWORD', 'URL', function(e, json) {
          assert(request.get.calledOnce);
          var auth = "Basic " + new Buffer('USER:PASSWORD').toString("base64");
          assert.deepEqual(request.get.args[0][0], { url: 'URL', headers: { "Authorization": auth } });
          done(e);
        });
      });

      it('should return correct json', function(done) {
        var xml = '<Projects><Project name="NAME" lastBuildStatus="SUCCESS" lastBuildTime="2013-03-22T15:31:43"/><Project name="NAME2" lastBuildStatus="SUCCESS" lastBuildTime="2013-03-22T15:31:42"/></Projects>';
        sinon.stub(request, 'get').yields(null, null, xml);
        gotadaa._getJson('USER', 'PASSWORD', 'URL', function(e, json) {
          var expectedJson = {projects:{project:[{name:"NAME", lastbuildstatus:"SUCCESS", lastbuildtime:"2013-03-22T15:31:43"}, {name:"NAME2", lastbuildstatus:"SUCCESS", lastbuildtime:"2013-03-22T15:31:42"}]}};
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
      });

      afterEach(function() {
      });

      it.skip('should return failed projects', function() {
        var projects = {};
        var result = gotadaa._getFailedProjects(projects, 'name', 0)
      });
    });
  });