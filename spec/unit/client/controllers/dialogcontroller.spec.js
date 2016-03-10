(function() {
  'use strict';

  describe('dialog ctrl', function() {
    var state,
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
      scope,
      $httpBackend,
      $mdDialog,
      controller,
      user,
      Users = {
        save: function(user, cb, errCb) {
          if (user.email === 'tee@tee.com') {
            cb({
              token: 'token',
              user: {
                _id: 1,
                email: 'admin'
              }
            });
          } else if (user.email === 'tay@tay.com') {
            errCb({
              user: {
                _id: 2,
                email: 'tay'
              },
              status: 409
            });
          } else if (!user.email) {
            errCb({
              user: {
                _id: 3,
                email: null
              },
              status: 500
            });
          }
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

    beforeEach(inject(function($injector) {
      var $controller = $injector.get('$controller');
      $httpBackend = $injector.get('$httpBackend');
      scope = $injector.get('$rootScope');
      state = $injector.get('$state');
      $mdDialog = $injector.get('$mdDialog');
      controller = $controller('DialogController', {
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
      $httpBackend.when('GET', 'jade/modal.html')
        .respond(200, [{
          res: 'res'
        }]);
    }));

    beforeEach(function() {
      scope.init();
    });

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

    it('should call $scope.hide', function() {
      spyOn($mdDialog, 'hide').and.callThrough();
      scope.hide();
      expect($mdDialog.hide).toHaveBeenCalled();
    });

    it('should call $scope.cancel', function() {
      spyOn($mdDialog, 'cancel').and.callThrough();
      scope.cancel();
      expect($mdDialog.cancel).toHaveBeenCalled();
    });

    it('should save user', function() {
      user = {
        email: 'tee@tee.com',
        password: 'bbb',
        role: {
          _id: '2456'
        }
      };
      spyOn(Users, 'save').and.callThrough();
      spyOn(state, 'go').and.callThrough();
      scope.signUpSocial(user);
      expect(Users.save).toHaveBeenCalled();
      expect(state.go).toHaveBeenCalled();
    });
  });
})();
