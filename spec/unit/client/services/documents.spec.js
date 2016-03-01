(function() {
  'use strict';

  describe('Document Service Test', function() {
  var Documents;

    beforeEach(function() {
      module('Doccy');
    });

    beforeEach(module(function($provide){
      var facebook,
      google;
      facebook = google = {
        init: function(){
          return 'something';
        }
      };
      $provide.value('facebook', facebook);
      $provide.value('google', google);
    }));

    beforeEach(inject(function($injector) {
      Documents = $injector.get('Documents');
    }));

    describe('Documents unit tests', function() {
      it('update should be a function', function() {
        expect(Documents.update).toBeDefined();
        expect(typeof Documents.update).toBe('function');
      });
    });
  });
})();
