(function() {
  'use strict';

  describe('Roles Service Test', function() {
  var Roles;

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
      Roles = $injector.get('Roles');
    }));

    describe('Documents unit tests', function() {
      it('update should be a function', function() {
        expect(Roles.update).toBeDefined();
        expect(typeof Roles.update).toBe('function');
      });
    });
  });
})();
