(function() {
  'use strict';

  describe('dialog ctrl', function() {
    var mdDialog,
      controller,
      scope;
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
      mdDialog = $injector.get('$mdDialog');
      scope = $injector.get('$rootScope');
      controller = $controller('docCtrl', {
        $scope: scope
      });
    }));

    it('should call scope.hide', function() {
      spyOn(mdDialog, 'hide').and.callThrough();
      scope.hide();
      expect(mdDialog.hide).toHaveBeenCalled();
    });

    it('should call scope.cancel', function() {
      spyOn(mdDialog, 'cancel').and.callThrough();
      scope.cancel();
      expect(mdDialog.cancel).toHaveBeenCalled();
    });
  });
})();
