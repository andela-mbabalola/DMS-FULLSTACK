angular.module('dms.controllers');.controller('HeaderCtrl', ['Users', '$scope',
  function($scope) {
    // logout
    $scope.logout = function() {
      Users.logout(function(err, res) {
        if (!err) {
          delete $rootScope.currentUser;
          Auth.logout();
          $state.go('login');
        } else {
          console.log(err, res);
        }
      });
    };
  }
]);
