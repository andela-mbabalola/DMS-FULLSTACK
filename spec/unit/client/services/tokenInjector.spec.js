(function() {
  'use strict';

  describe('Token Service Test', function() {

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

    var TokenInjector,
     Token;
    beforeEach(inject(function($injector) {
      TokenInjector = $injector.get('TokenInjector');
      Token = $injector.get('Token');
    }));

    describe('TokenInjector unit tests', function() {

      it('request should be a function', function() {
        expect(TokenInjector.request).toBeDefined();
        expect(typeof TokenInjector.request).toBe('function');
      });

      it('request should call Token.get', function() {
        var config = {
          url: '/api/here',
          headers: {
            'x-access-token': 'token'
          }
        };

        expect(TokenInjector.request(config)
        .headers['x-access-token']).toBe('token');
        expect(typeof TokenInjector.request(config)).toBe('object');
      });
    });
  });
})();
