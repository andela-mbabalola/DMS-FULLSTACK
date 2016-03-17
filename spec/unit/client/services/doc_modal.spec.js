(function() {
  'use strict';

  describe('DocModal Service Test', function() {
    var DocModal,
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
      DocModal = $injector.get('DocModal');
      mdToast = $injector.get('$mdToast');
      mdDialog = $injector.get('$mdDialog');
    }));

    describe('DocModal unit tests', function() {
      it('toast should be a function', function() {
        expect(DocModal.toast).toBeDefined();
        expect(typeof DocModal.toast).toBe('function');
      });

      it('$mdToast.show should be called', function() {
        spyOn(mdToast, 'show');
        DocModal.toast('text');
        expect(mdToast.show).toHaveBeenCalled();
      });

      it('mdDialog.show should be called', function() {
        spyOn(mdDialog, 'show').and.callThrough();
        DocModal.dialog();
        expect(mdDialog.show).toHaveBeenCalled();
      });

      it('$mdToast and its method show should be defined', function() {
        expect(mdToast.show).toBeDefined();
        expect(typeof mdToast.show).toBe('function');
      });

      it('dialog should be a function', function() {
        expect(DocModal.dialog).toBeDefined();
        expect(typeof DocModal.dialog).toBe('function');
      });

      it('$mdDialog and its method show should both be defined', function() {
        expect(mdDialog.show).toBeDefined();
        expect(typeof mdDialog.show).toBe('function');
        spyOn(mdDialog, 'show');
        DocModal.modal();
        expect(mdDialog.show).toHaveBeenCalled();
      });
    });
  });
})();
