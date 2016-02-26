(function() {
  'use strict';

  describe('modal Service Test', function() {
    var modal,
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
      modal = $injector.get('modal');
      mdToast = $injector.get('$mdToast');
      mdDialog = $injector.get('$mdDialog');
    }));

    describe('DocPreviewModal unit tests', function() {
      it('toast should be a function', function() {
        expect(modal.toast).toBeDefined();
        expect(typeof modal.toast).toBe('function');
      });

      it('mdToast.show should be called', function() {
        spyOn(mdToast, 'show');
        modal.toast('text');
        expect(mdToast.show).toHaveBeenCalled();
      });

      it('mdToast and its method show should be defined', function() {
        expect(mdToast.show).toBeDefined();
        expect(typeof mdToast.show).toBe('function');
      });

      it('mdDialog and its method show should both be defined', function() {
        expect(mdDialog.show).toBeDefined();
        expect(typeof mdDialog.show).toBe('function');
        spyOn(mdDialog, 'show').and.callThrough();
        modal.modal();
        expect(mdDialog.show).toHaveBeenCalled();
      });
    });
  });
})();
