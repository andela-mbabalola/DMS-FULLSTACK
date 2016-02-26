(function() {
  'use strict';

  angular.module('Doccy.services')
    .factory('Users', ['$resource', '$http', ($resource, $http) => {
      var user = $resource('/api/users/:id', {
        id: '@_id'
      }, {
        update: {
          //method to issue a PUT request
          method: 'PUT'
        }
      }, {
        stripTrailingSlashes: false
      });

      user.login = function(user, cb) {
        $http.post('/api/users/login', user).success((res) => {
          cb(null, res);
        }).error(function(err) {
          cb(err);
        });
      };

      user.logout = function(cb) {
        $http.get('/api/users/logout').success(function(res) {
          cb(null, res);
        }).error(function(err) {
          cb(err);
        });
      };

      user.session = function(cb) {
        $http.get('/api/users/session').success(function(res) {
          cb(null, res);
        }).error(function(err) {
          cb(err);
        });
      };

      user.userDocs = function(user, cb) {
        $http.get('/api/user/' + user._id + '/documents').success((res) => {
          cb(null, res);
        }).error(function(err) {
          cb(err);
        });
      };

      // Finds a particular user
      user.getAUser = function(user, cb) {
        $http.get('/api/user/' + user._id)
          .success(function(res) {
            cb(null, res);
          }).error(function(err) {
            cb(err);
          });
      };
      return user;
    }]);
})();
