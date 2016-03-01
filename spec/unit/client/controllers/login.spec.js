(function() {
  'use strict';

  describe('LoginCtrl', function() {
    var scope,
      state,
      Users,
      controller,
      mdToast,
      modal,
      facebook,
      google,
      $httpBackend,
      Auth = {
        isLoggedIn: function() {
          return true;
        },
        setToken: function() {
          return {
            token: 'token'
          };
        }
      };

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

    facebook = {
      login: function(user, cb) {
        if (user.facebook_id === 1) {
          cb(null, {
            id: '1',
            first_name: 'maryam',
            'last_name': 'whatever',
          });
        }
      }
    };

    google = {
      login: function(cb) {
        cb(null, {
          id: '1',
          first_name: 'maryam',
          'last_name': 'whatever',
        });
      }
    };

    Users = {
      login: function(user, cb) {
        if (user.email === 'tay@tay.com') {
          cb(null, {
            token: 'token',
            user: {
              _id: 0,
              email: 'tay@tay.com'
            }
          });
        } else if (user.email === 'owner@gmail.com') {
          cb(null, {
            token: 'token',
            user: {
              _id: 1,
              email: 'owner@gmail.com'
            }

          });
        } else if (user.email === null) {
          cb({
            status: 401,
            message: 'Authentication failed. Wrong password',
            user: {
              _id: 2
            }
          });
        }
      }
    };

    beforeEach(inject(function($injector) {
      var $controller = $injector.get('$controller');
      modal = $injector.get('modal');
      $httpBackend = $injector.get('$httpBackend');
      scope = $injector.get('$rootScope');
      state = $injector.get('$state');
      mdToast = $injector.get('$mdToast');
      controller = $controller('LoginCtrl', {
        $scope: scope,
        Users: Users,
        Auth: Auth,
        facebook: facebook,
        google: google,
      });

      $httpBackend.when('GET', '/api/users/session')
        .respond(200, [{
          res: 'res'
        }]);

      $httpBackend.when('GET', 'jade/home.html')
        .respond(200, [{
          res: 'res'
        }]);
    }));

    it('scope.login should call login user', function() {
      scope.user = {
        email: 'tay@tay.com',
        password: '1111'
      };
      spyOn(Users, 'login').and.callThrough();
      spyOn(state, 'go').and.callThrough();
      scope.login();
      expect(Users.login).toHaveBeenCalled();
      expect(state.go).toHaveBeenCalledWith('userProfile.edit', {
        id: 0
      });
    });

    it('scope.login should call Users.login and return error', function() {
      scope.user = {
        email: 'owner@gmail.com',
        password: '1111'
      };
      spyOn(Users, 'login').and.callThrough();
      spyOn(state, 'go').and.callThrough();
      scope.login();
      expect(Users.login).toHaveBeenCalled();
      expect(state.go).toHaveBeenCalledWith('adminProfile', {
        id: 1
      });
    });

    it('scope.login should call Users.login and return error', function() {
      scope.user = {
        email: null,
        password: '1111'
      };
      spyOn(Users, 'login').and.callThrough();
      spyOn(mdToast, 'show').and.callThrough();
      scope.login();
      expect(Users.login).toHaveBeenCalled();
      expect(mdToast.show).toHaveBeenCalled();
    });

    it('scope.login should call facebook login', function() {
      spyOn(facebook, 'login').and.callThrough();
      scope.facebookLogin();
      expect(facebook.login).toHaveBeenCalled();
    });

    it('scope.login should call google login', function() {
      spyOn(google, 'login').and.callThrough();
      scope.googleLogin();
      expect(google.login).toHaveBeenCalled();
    });
  });
})();
