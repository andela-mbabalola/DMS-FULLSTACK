(function() {
  'use strict';

  angular.module('Doccy.controllers')
    .controller('SignUpCtrl', ['$rootScope', '$scope', '$http',
     '$state', 'Users', 'Auth', '$mdToast',
     function ($rootScope, $scope, $http, $state, Users, Auth, $mdToast) {

      $http.get('/api/role/roles')
        .then(function(resp) {
          $scope.roles = resp.data;
        });
      //signUp
      $scope.signUp = function()  {
        var user = {
          email: $scope.user.email,
          password: $scope.user.password,
          role: $scope.user.role._id
        };

        Users.save(user, function(res)  {
          Auth.setToken(res.token);
          $rootScope.currentUser = res;
          if ($rootScope.currentUser.user.email === 'owner@gmail.com') {
            $state.go('adminProfile', {
              id: $rootScope.currentUser.user._id
            });
          } else {
              $state.go('userProfile.documents', {
                id: $rootScope.currentUser.user._id
              });
            }
        }, function(err) {
            if(err.status === 409 && err.statusText === 'Conflict') {
              $mdToast.show($mdToast.simple()
              .textContent('User already exists!').hideDelay(2000));
            } else {
              $mdToast.show($mdToast.simple()
                .textContent('Problem creating user').hideDelay(2000));
            }
        });
      };
    }]);
})();
