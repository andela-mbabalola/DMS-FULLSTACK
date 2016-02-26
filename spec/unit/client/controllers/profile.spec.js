(function() {
  'use strict';

  describe('ProfileCtrl Controller tests', function() {
    var scope,
      Users,
      mdToast,
      controller,
      state,
      rootScope,
      currentUser = {
        email: 'tee@top.com',
        userName: 'tee',
        password: '111'
      },
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
      $http,
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
      update: function(user, cb, err) {
        if (user.email === 'tee@top.com') {
          cb({
            token: 'token',
            user: {
              _id: 1,
            }
          });
        } else if (user.email === null) {
          err({
            user: {
              _id: 3,
              email: null
            },
            status: 500
          });
        }
      }
    };

    beforeEach(inject(function($injector) {
      var $controller = $injector.get('$controller');
      scope = $injector.get('$rootScope');
      rootScope = $injector.get('$rootScope');
      rootScope.currentUser = currentUser;
      mdToast = $injector.get('$mdToast');
      $http = $injector.get('$http');
      $httpBackend = $injector.get('$httpBackend');
      state = $injector.get('$state');
      controller = $controller('ProfileCtrl', {
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

    it('should update user Profile', function() {
      spyOn(Users, 'update');
      scope.editProfile();
      expect(Users.update).toHaveBeenCalled();
    });

    it('scope.editProfile should call Users.update', function() {
      scope.user = {
        email: 'tee@top.com',
        password: '111'
      };
      spyOn(Users, 'update').and.callThrough();
      spyOn(mdToast, 'show').and.callThrough();
      scope.editProfile();
      expect(Users.update).toHaveBeenCalled();
      expect(mdToast.show).toHaveBeenCalled();
    });

    it('scope.editProfile should call Users.update with error 409', function() {
      scope.user = {
        email: null,
        password: '111'
      };
      spyOn(Users, 'update').and.callThrough();
      spyOn(mdToast, 'show').and.callThrough();
      scope.editProfile();
      expect(Users.update).toHaveBeenCalled();
      expect(mdToast.show).toHaveBeenCalled();
    });
  });
})();
