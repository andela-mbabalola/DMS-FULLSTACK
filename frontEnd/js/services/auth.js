angular.module('Doccy.services')
  .factory('Auth', ['Token', (Token)=> {
    return {
      isLoggedIn: ()=> {
          if(Token.get()) {
            return true;
          } else {
            return false;
          }
      },
      setToken: (token)=> {
        Token.set(token);
      },
      logout: ()=> {
         Token.remove();
      }
    };
  }]);
