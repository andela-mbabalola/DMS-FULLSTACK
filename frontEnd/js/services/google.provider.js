  angular.module('Doccy.providers')
    .provider('google', function() {
      this.appConfig = {};
      this.setAppConfig = function(object) {
        this.appConfig = object;
      };
      this.getUserInfo = function(authResponse, cb) {
        if (authResponse.status.signed_in) {
          if (authResponse.status.method == 'PROMPT') {
            gapi.client.load('oauth2', 'v2', function() {
              gapi.client.oauth2.userinfo.get()
                .execute(function(resp) {
                  cb(null, resp);
                });
            });
          }
        } else {
          cb('Not logged in');
        }
      };
      this.$get = function() {
        var appConfig = this.appConfig,
         addr = 'https://apis.google.com/js/auth:plusone.js?onload=startApp';
        return {
          init: () => {
            (function() {
              var po = document.createElement('script');
              po.type = 'text/javascript';
              po.async = true;
              po.src = addr;
              var s = document.getElementsByTagName('script')[0];
              s.parentNode.insertBefore(po, s);
            })();
            (function() {
              var po = document.createElement('script');
              po.type = 'text/javascript';
              po.async = true;
              po.src = 'https://apis.google.com/js/client:platform.js';
              var s = document.getElementsByTagName('script')[0];
              s.parentNode.insertBefore(po, s);
            })();
          },
          login: (cb) => {
            gapi.auth.signIn({
              'callback': (authResponse) => {
                this.getUserInfo(authResponse, cb);
              },
              'clientid': appConfig.CLIENTID,
              'scope': appConfig.SCOPE,
              'theme': 'dark',
              'cookiepolicy': appConfig.COOKIEPOLICY || 'single_host_origin',
              'accesstype': 'token'
            });
          }
        };
      };
    });
