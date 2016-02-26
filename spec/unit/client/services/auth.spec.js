(function() {
  'use strict';

  describe('Auth Service Test', function() {
    var Auth,
      Token;

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
      Auth = $injector.get('Auth');
      Token = $injector.get('Token');
    }));

    describe('Auth unit tests', function() {
      it('isLoggedIn should be a function', function() {
        expect(Auth.isLoggedIn).toBeDefined();
        expect(typeof Auth.isLoggedIn).toBe('function');
      });

      it('setToken should call Token.set', function() {
        spyOn(Token, 'get').and.callThrough();
        Auth.isLoggedIn();
        expect(Token.get).toHaveBeenCalled();
      });

      it('setToken should be a function', function() {
        expect(Auth.setToken).toBeDefined();
        expect(typeof Auth.setToken).toBe('function');
      });

      it('setToken should call Token.set', function() {
        spyOn(Token, 'set').and.callThrough();
        Auth.setToken('token');
        expect(Token.set).toHaveBeenCalled();
        expect(Token.get().length).toBe(5);
      });

      it('logout should be a function and be defined', function() {
        expect(Auth.logout).toBeDefined();
        expect(typeof Auth.logout).toBe('function');
      });
    });
  });
})();
