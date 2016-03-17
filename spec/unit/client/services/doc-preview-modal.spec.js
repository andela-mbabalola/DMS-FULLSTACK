(function() {
  'use strict';

  describe('DocPreviewModal Service Test', function() {
    var DocPreviewModal,
      mdDialog,
      mdToast;

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
      DocPreviewModal = $injector.get('DocPreviewModal');
      mdToast = $injector.get('$mdToast');
      mdDialog = $injector.get('$mdDialog');
    }));

    describe('DocPreviewModal unit tests', function() {
      it('toast should be a function', function() {
        expect(DocPreviewModal.toast).toBeDefined();
        expect(typeof DocPreviewModal.toast).toBe('function');
      });

      it('mdToast.show should be called', function() {
        spyOn(mdToast, 'show');
        DocPreviewModal.toast('text');
        expect(mdToast.show).toHaveBeenCalled();
      });

      it('mdToast and its method show should be defined', function() {
        expect(mdToast.show).toBeDefined();
        expect(typeof mdToast.show).toBe('function');
      });

      it('dialog should be called', function() {
        expect(DocPreviewModal.dialog).toBeDefined();
        expect(typeof DocPreviewModal.dialog).toBe('function');
      });

      it('mdDialog and its method show should both be defined', function() {
        expect(mdDialog.show).toBeDefined();
        expect(typeof mdDialog.show).toBe('function');
        spyOn(mdDialog, 'show');
        DocPreviewModal.modal();
        expect(mdDialog.show).toHaveBeenCalled();
      });
    });
  });
})();
