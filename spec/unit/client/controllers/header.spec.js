(function() {
  'use strict';

  describe('HeaderCtrl tests', function() {
    var scope,
      controller,
      state,
      Auth;
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
      scope = $injector.get('$rootScope');
      controller = $controller('HeaderCtrl', {
        $scope: scope,
      });
      Auth = $injector.get('Auth');
      state = $injector.get('$state');
    }));

    it('should define and call logout', function() {
      scope.currentUser = 1;
      spyOn(Auth, 'logout').and.callThrough();
      spyOn(state, 'go');
      scope.logout();
      expect(Auth.logout).toHaveBeenCalled();
      expect(state.go).toHaveBeenCalled();
    });
  });
})();
