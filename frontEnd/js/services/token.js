angular.module('Doccy.services')
  .factory('Token', ['$window',
    ($window)=> {
        return {
          set: (token)=> {
            $window.localStorage.setItem('token', token);
          },
          get: ()=> {
            return $window.localStorage.getItem('token');
          },
          remove:()=> {
            $window.localStorage.removeItem('token');
          }
        };
    }
  ]);
