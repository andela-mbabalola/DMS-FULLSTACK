(function() {
  'use strict';

  describe('docPreview ctrl', function() {
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
      controller = $controller('docpreviewCtrl', {
        $scope: scope
      });
    }));

    it('should call scope.hide', function() {
      spyOn(mdDialog, 'hide');
      scope.hide();
      expect(mdDialog.hide).toHaveBeenCalled();
    });

    it('should call scope.cancel', function() {
      spyOn(mdDialog, 'cancel');
      scope.cancel();
      expect(mdDialog.cancel).toHaveBeenCalled();
    });
  });
})();
