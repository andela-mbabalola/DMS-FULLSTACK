(function() {
  'use strict';

  describe('Token Service Test', function() {

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

    var Token;
    beforeEach(inject(function($injector) {
      Token = $injector.get('Token');
    }));

    describe('Token unit tests', function() {
      it('Token.set should be a function', function() {
        expect(Token.set).toBeDefined();
        expect(typeof Token.set).toBe('function');
      });

      it('Token.get should be a function', function() {
        expect(Token.get).toBeDefined();
        expect(typeof Token.get).toBe('function');
        Token.set('token');
        expect(Token.get()).toBe('token');
      });

      it('Token.remove should be a function and be defined', function() {
        expect(Token.remove).toBeDefined();
        expect(typeof Token.remove).toBe('function');
      });
      it('Token.remove should delete token', function() {
        Token.remove();
        expect(Token.get()).toBeNull();
      });
    });
  });
})();
