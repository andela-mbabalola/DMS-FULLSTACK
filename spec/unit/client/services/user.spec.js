(function() {
  'use strict';

  describe('Users service', function() {
    //load the angular module
    beforeEach(function() {
      module('Doccy');
    });

    beforeEach(module(function($provide) {
      var facebook,
        google;
      facebook = google = {
        init: function() {
          return 'something';
        }
      };
      $provide.value('facebook', facebook);
      $provide.value('google', google);
    }));

    beforeEach(module(function($provide) {
      var facebook,
        google;
      facebook = google = {
        init: function() {
          return 'something';
        }
      };
      $provide.value('facebook', facebook);
      $provide.value('google', google);
    }));

    var Users,
      $httpBackend;
    beforeEach(inject(function($injector) {
      Users = $injector.get('Users');
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', '/api/users/session')
        .respond(200, [{
          res: 'res'
        }]);

      $httpBackend.when('GET', 'jade/home.html')
        .respond(200, [{
          res: 'res'
        }]);
    }));

    describe('User unit tests', function() {
      it('login should be a function', function() {
        expect(Users.login).toBeDefined();
        expect(typeof Users.login).toBe('function');
      });

      it('should test success of login function', function() {
        var error,
          response,
          cb = function(err, res) {
            if (err) {
              error = err;
              response = null;
            } else {
              error = null;
              response = res;
            }
          };
        $httpBackend.when('POST', '/api/users/login').respond(200, {
          res: 'res'
        });

        Users.login({
          data: 'data'
        }, cb);

        $httpBackend.flush();
        expect(response.res).toBeDefined();
        expect(response.res).toBe('res');
      });

      it('should test error of login function', function() {
        var error,
          response,
          cb = function(err, res) {
            if (err) {
              error = err;
              response = null;
            } else {
              error = null;
              response = res;
            }
          };

        $httpBackend.when('POST', '/api/users/login').respond(500, {
          err: 'err'
        });

        Users.login({
          data: 'data'
        }, cb);

        $httpBackend.flush();
        expect(error.err).toBeDefined();
        expect(error.err).toBe('err');
      });
    });

    describe('User.userDocs unit test', function() {
      it('userDocs should be a function', function() {
        expect(Users.userDocs).toBeDefined();
        expect(typeof Users.userDocs).toBe('function');
      });

      it('should test success of userDocs function', function() {
        var error,
          response,
          cb = function(err, res) {
            if (err) {
              error = err;
              response = null;
            } else {
              error = null;
              response = res;
            }
          };

        $httpBackend.whenGET(/\/api\/user\/(.+)\/documents/,
          undefined, undefined, ['id']).respond(200, {
          res: 'res'
        });

        Users.userDocs(5, cb);
        $httpBackend.flush();
        expect(response.res).toBeDefined();
        expect(response.res).toBe('res');
      });

      it('should test error of userDocs function', function() {
        var error, response;
        var cb = function(err, res) {
          if (err) {
            error = err;
            response = null;
          } else {
            error = null;
            response = res;
          }
        };

        $httpBackend.whenGET(/\/api\/user\/(.+)\/documents/,
          undefined, undefined, ['id']).respond(500, {
          err: 'err'
        });

        Users.userDocs(5, cb);
        $httpBackend.flush();
        expect(error.err).toBeDefined();
        expect(error.err).toBe('err');
      });
    });

    describe('Users.getAUser unit test', function() {
      it('getAUser should be a function', function() {
        expect(Users.getAUser).toBeDefined();
        expect(typeof Users.getAUser).toBe('function');
      });

      it('should test success of find function', function() {
        var error, response;
        var cb = function(err, res) {
          if (err) {
            error = err;
            response = null;
          } else {
            error = null;
            response = res;
          }
        };

        $httpBackend.whenGET(/\/api\/user\/(.+)/, undefined, ['id'])
        .respond(200, {
          res: 'res'
        });
        Users.getAUser({
          data: 'data'
        }, cb);
        $httpBackend.flush();
        expect(response.res).toBeDefined();
        expect(response.res).toBe('res');
      });

      it('should test error of find function', function() {
        var error, response;
        var cb = function(err, res) {
          if (err) {
            error = err;
            response = null;
          } else {
            error = null;
            response = res;
          }
        };

        $httpBackend.whenGET(/\/api\/user\/(.+)/, undefined, ['id'])
        .respond(500, {
          err: 'err'
        });

        Users.getAUser({
          data: 'data'
        }, cb);

        Users.getAUser(5, cb);
        $httpBackend.flush();
        expect(error.err).toBeDefined();
        expect(error.err).toBe('err');
      });
    });

    describe('Users session unit test', function() {
      it('session should be a function', function() {
        expect(Users.session).toBeDefined();
        expect(typeof Users.session).toBe('function');
      });
    });
  });
})();
