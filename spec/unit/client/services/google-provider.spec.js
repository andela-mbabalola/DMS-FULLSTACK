(function() {
  'use strict';

  var gapi;
  describe('google provider', function() {

    beforeEach(function() {
      module('Doccy');
    });

    beforeEach(module(function($provide) {
      var facebook,
        google;
      facebook = google = {
        init: function() {
          return 'something';
        },
        login: function() {
          return 'something';
        }
      };
      gapi = {
        auth: {
          signIn: function() {
            return 'something';
          }
        },
        client: {
          load: function() {
            function loadUser() {
              return {
                id: 1,
                firstName: 'just something'
              };
            }
            gapi.client.oauth2.userinfo.get().execute(loadUser);
          },
          oauth2: {
            userinfo: {
              get: function() {
                return gapi.client.oauth2.userinfo;
              },
              execute: function(cb) {
                cb();
              }
            }
          }
        }
      };
      $provide.value('facebook', facebook);
    }));

    var googleprovider;
    beforeEach(inject(function($injector) {
      googleprovider = $injector.get('google');
    }));

    it('We should have global Google object', function() {
      expect(googleprovider.login).toBeDefined();
      expect(typeof googleprovider.login).toBe('function');
    });

    it('google login should have been called', function() {
      spyOn(gapi.auth, 'signIn').and.callThrough();
      googleprovider.login();
      expect(gapi.auth.signIn).toHaveBeenCalled();
    });
  });
})();
