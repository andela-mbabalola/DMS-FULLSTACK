(function() {
  'use strict';

  angular.module('Doccy.services')
    .factory('TokenInjector', ['Token', function(Token) {
      var TokenInjector = {
        request: function(config) {
          var token = Token.get();
          if (token && config.url.indexOf('/api/') !== -1) {
            config.headers['x-access-token'] = token;
          }
          return config;
        }
      };
      return TokenInjector;
    }]);
})();
