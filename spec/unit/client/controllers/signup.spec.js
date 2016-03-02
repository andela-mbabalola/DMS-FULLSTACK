(function() {
  'use strict';

  describe('SignUpCtrl Controller tests', function() {
    var scope,
      Users,
      mdToast,
      controller,
      Auth = {
        isLoggedIn: function() {
          return true;
        },
        setToken: function() {
          return {
            token: 'token'
          };
        }
      },
      state,
      $httpBackend;
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

    Users = {
      save: function(user, cb, errCb) {
        if (user.email === 'tay@tay.com') {
          cb({
            token: 'token',
            user: {
              _id: 0,
              email: 'tay@tay.com'
            }
          });
        } else if (user.email === 'owner@gmail.com') {
          cb({
            token: 'token',
            user: {
              _id: 1,
              email: 'owner@gmail.com'
            }

          });
        } else if (user.email === null) {
          errCb({
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
      scope = $injector.get('$rootScope');
      mdToast = $injector.get('$mdToast');
      $httpBackend = $injector.get('$httpBackend');
      state = $injector.get('$state');
      controller = $controller('SignUpCtrl', {
        $scope: scope,
        Users: Users,
        Auth: Auth
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

    it('should get all roles', function() {
      $httpBackend.when('GET', '/api/role/roles').respond(200, {
        data: 'res'
      });

      $httpBackend.flush();
      expect(scope.roles).toBeDefined();
      expect(scope.roles).toEqual({
        data: 'res'
      });
    });


    it('scope.signUp should call Users.save', function() {
      scope.user = {
        email: 'tay@tay.com',
        password: '1111',
        role: {
          _id: '2456'
        }
      };
      spyOn(Users, 'save').and.callThrough();
      spyOn(state, 'go').and.callThrough();
      scope.signUp();
      expect(Users.save).toHaveBeenCalled();
      expect(state.go).toHaveBeenCalledWith('userProfile.edit', {
        id: 0
      });
    });

    it('scope.signUp should call Users.save and return error 409', function() {
      scope.user = {
        email: 'owner@gmail.com',
        password: '1111',
        role: {
          _id: '1234'
        }
      };
      spyOn(Users, 'save').and.callThrough();
      spyOn(state, 'go').and.callThrough();
      scope.signUp();
      expect(Users.save).toHaveBeenCalled();
      expect(state.go).toHaveBeenCalledWith('adminProfile', {
        id: 1
      });
    });

    it('scope.signUp should call Users.save and return error 500', function() {
      scope.user = {
        email: null,
        password: 'ccc',
        role: {
          _id: '5555'
        }
      };
      spyOn(Users, 'save').and.callThrough();
      spyOn(mdToast, 'show').and.callThrough();
      scope.signUp();
      expect(Users.save).toHaveBeenCalled();
      expect(mdToast.show).toHaveBeenCalled();
    });
  });
})();
