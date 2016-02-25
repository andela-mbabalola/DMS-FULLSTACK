(function() {
  'use strict';

  angular.module('Doccy.providers')
    .provider('facebook', function() {
      this.appId = 'sampleappId';
      this.setAppId = function(value) {
        this.appId = value;
      };
      this.$get = function() {
        var appId = this.appId;
        return {
          init: () => {
            FB.init({
              appId: appId,
              xfbml: true,
              version: 'v2.5'
            });
          },

          login: function(cb) {
            FB.login(function(response) {
              if (response.status === 'connected') {
                FB.api('/me?fields=first_name,last_name,email,picture',
                  function(res) {
                    cb(null, res);
                  });
              } else if (response.status === 'not_authorized') {
                cb('not recoginzed', null);
                // The person is logged into Facebook, but not your app.
              } else {
                cb('Not Authorized');
                // The person is not logged into Facebook, so we're not sure if
                // they are logged into this app or not.
              }
            }, {
              scope: 'public_profile, email'
            });
          }
        };
      };
    });
})();
