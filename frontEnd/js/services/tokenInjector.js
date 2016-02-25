angular.module('Doccy.services')
  .factory('TokenInjector', ['Token', (Token)=> {
    var TokenInjector = {
      request: (config)=> {
          var token = Token.get();
          if (token) {
            config.headers['x-access-token'] = token;
          }
          return config;
      }
    };
    return TokenInjector;
  }]);
