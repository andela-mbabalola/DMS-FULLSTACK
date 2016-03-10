
  var FB;
  describe('facebook provider', function () {
    var facebookprovider;
    beforeEach(function() {
      module('Doccy');
    });

    beforeEach(module(function($provide){
      var google;
      google = {
        init: function(){
          return 'something';
        },
        login: function() {
          return 'something';
        }
      };
      FB = {
        login: function(cb){
          var response = {
            status: 'connected'

          };
          cb(response);
        },
        init: function(){
          return 'someting';
        },
        api: function(){
          return 'something';
        }

      };
      $provide.value('google', google);
    }));

    beforeEach(inject(function($injector) {
      facebookprovider = $injector.get('facebook');
    }));

    it('We should have global Facebook object', function() {
      expect(facebookprovider.login).toBeDefined();
      expect(typeof facebookprovider.login).toBe('function');
    });

    it('facebook init should have been called', function(){
      spyOn(FB, 'init');
      facebookprovider.init();
      expect(FB.init).toHaveBeenCalled();
    });

    it('facebook login should have been called', function() {
      spyOn(FB, 'login').and.callThrough();
      spyOn(FB, 'api').and.callThrough();
      facebookprovider.login();
      expect(FB.login).toHaveBeenCalled();
      expect(FB.api).toHaveBeenCalled();
    });
  });
