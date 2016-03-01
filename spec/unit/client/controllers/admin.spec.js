(function() {
  'use strict';

  describe('Admin panel ctrl', function() {
    var $http,
      controller,
      $httpBackend,
      scope,
      state,
      mdDialog,
      mdToast,
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
      Users = {
        query: function(cb) {
          cb([1, 2, 3]);
        },
        remove: function(user, cb, cbb) {
          return !user._id ? cbb() : cb();
        }
      },
      Roles = {
        save: function(doc, cb, err) {
           return !doc.fail ? cb(doc) : err(null, true);
        },
        remove: function(doc, cb, cbb) {
          return !doc._id ? cbb() : cb();
        }
      },
      Documents = {
        query: function(cb) {
          cb([1, 2, 3]);
        },
        remove: function(doc, cb, cbb) {
          return !doc._id ? cbb() : cb();
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
      mdDialog = {
        confirm: function() {
          return mdDialog;
        },
        show: function() {
          return mdDialog;
        },
        then: function(cb) {
          cb();
        },
        targetEvent: function() {
          return mdDialog;
        },
        ok: function() {
          return mdDialog;
        },
        ariaLabel: function() {
          return mdDialog;
        },
        textContent: function() {
          return mdDialog;
        },
        title: function() {
          return mdDialog;
        },
        cancel: function() {
          return 'canceled';
        }
      };
      $provide.value('facebook', facebook);
      $provide.value('google', google);
      $provide.value('mdDialog', mdDialog);
    }));

    beforeEach(inject(function($injector) {
      var $controller = $injector.get('$controller');
      scope = $injector.get('$rootScope');
      mdToast = $injector.get('$mdToast');
      $http = $injector.get('$http');
      state = $injector.get('$state');
      $httpBackend = $injector.get('$httpBackend');
      controller = $controller('AdminPanelController', {
        $scope: scope,
        Users: Users,
        Roles: Roles,
        $state: state,
        Documents: Documents,
        $mdDialog: mdDialog,
        Auth: Auth
      });
    }));

    it('should call init function', function() {
      spyOn(Users, 'query').and.callThrough();
      spyOn(Documents, 'query').and.callThrough();
      expect(scope.init).toBeDefined();
      scope.init();
      expect(Users.query).toHaveBeenCalled();
      expect(scope.users).toBeDefined();
      expect(scope.users).toEqual([1, 2, 3]);
      expect(Documents.query).toHaveBeenCalled();
      expect(scope.documents).toBeDefined();
      expect(scope.documents).toEqual([1, 2, 3]);
    });

    it('should call delete function and delete user', function() {
      scope.user = {
        _id: 1
      };
      spyOn(Users, 'remove').and.callThrough();
      spyOn(mdDialog, 'confirm').and.callThrough();
      spyOn(mdDialog, 'show').and.callThrough();
      spyOn(mdToast, 'show').and.callThrough();
      spyOn(state, 'reload').and.returnValue(0);
      scope.deleteUser('ev', scope.user);
      expect(mdDialog.confirm).toHaveBeenCalled();
      expect(mdDialog.show).toHaveBeenCalled();
      expect(mdToast.show).toHaveBeenCalled();
      expect(Users.remove).toHaveBeenCalled();
      expect(state.reload).toHaveBeenCalled();
    });

    it('should call delete function and delete roles', function() {
      scope.role = {
        _id: 1
      };
      spyOn(Roles, 'remove').and.callThrough();
      spyOn(mdDialog, 'confirm').and.callThrough();
      spyOn(mdDialog, 'show').and.callThrough();
      spyOn(mdToast, 'show').and.callThrough();
      spyOn(state, 'reload').and.returnValue(0);
      scope.deleteRole('ev', scope.role);
      expect(mdDialog.confirm).toHaveBeenCalled();
      expect(mdDialog.show).toHaveBeenCalled();
      expect(mdToast.show).toHaveBeenCalled();
      expect(Roles.remove).toHaveBeenCalled();
      expect(state.reload).toHaveBeenCalled();
    });

    it('should define and create a role', function() {
      scope.role = {
        _id: '345',
        title: 'user',
      };
      spyOn(Roles, 'save').and.callThrough();
      scope.createRoleBtn();
      expect(Roles.save).toHaveBeenCalled();
    });


    it('should call delete function and delete document', function() {
      scope.doc = {
        _id: 1
      };
      spyOn(Documents, 'remove').and.callThrough();
      spyOn(mdDialog, 'confirm').and.callThrough();
      spyOn(mdDialog, 'show').and.callThrough();
      spyOn(mdToast, 'show').and.callThrough();
      spyOn(state, 'reload').and.returnValue(0);
      scope.deleteDocument('ev', scope.doc);
      expect(mdDialog.confirm).toHaveBeenCalled();
      expect(mdDialog.show).toHaveBeenCalled();
      expect(mdToast.show).toHaveBeenCalled();
      expect(Documents.remove).toHaveBeenCalled();
      expect(state.reload).toHaveBeenCalled();
    });
  });
})();
