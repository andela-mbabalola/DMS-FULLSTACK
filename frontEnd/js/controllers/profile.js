angular.module('Doccy.controllers')
  .controller('ProfileCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'Users',
    '$http',
    function($scope, $rootScope, $state, Users, $http) {

      $http.get('/api/role/roles')
        .then(function(resp){
          $scope.roles = resp.data;
        });

      $scope.editProfile = function() {
        console.log($rootScope.currentUser);
      Users.update($rootScope.currentUser, function() {
        $scope.message =
          'You have successfully updated your profile.';
      }, function(err) {
        console.log(err);
        console.log($rootScope.currentUser);
        $scope.message =
          'There was a problem updating your profile.';
      });
    };
    }
  ]);
