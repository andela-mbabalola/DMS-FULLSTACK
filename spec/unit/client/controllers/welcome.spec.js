(function() {
  'use strict';

  describe('welcomeCtrl tests', function() {
    var scope,
      controller,
      Documents,
      DocPreviewModal;
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
      DocPreviewModal = $injector.get('DocPreviewModal');
      controller = $controller('welcomeCtrl', {
        $scope: scope
      });
      Documents = $injector.get('Documents');
      scope.init();
    }));

    it('should show the DocPreviewModal', function() {
      spyOn(DocPreviewModal, 'modal').and.callThrough();
      scope.previewDocModal();
      expect(DocPreviewModal.modal).toHaveBeenCalled();
    });

    it('should set some variables', function() {
      expect(scope.documents).toBeTruthy();
    });
  });
})();
