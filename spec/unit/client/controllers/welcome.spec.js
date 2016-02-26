(function() {
  'use strict';

  describe('welcomeCtrl tests', function() {
    var scope,
      controller,
      $httpBackend,
      Documents = {
        query: function(cb) {
          cb([1, 2, 3]);
        }
      },
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
      $httpBackend = $injector.get('$httpBackend');
      DocPreviewModal = $injector.get('DocPreviewModal');
      controller = $controller('welcomeCtrl', {
        $scope: scope,
        Documents: Documents
      });
    }));

    it('should get all documents', function() {
      spyOn(Documents, 'query').and.callThrough();
      expect(scope.init).toBeDefined();
      scope.init();
      expect(Documents.query).toHaveBeenCalled();
      expect(scope.documents).toBeDefined();
      expect(scope.documents).toEqual([1, 2, 3]);

    });

    it('should show the DocPreviewModal', function() {
      spyOn(DocPreviewModal, 'modal').and.callThrough();
      scope.previewDocModal();
      expect(DocPreviewModal.modal).toHaveBeenCalled();
    });
  });
})();
