angular.module('Doccy.controllers')
  .controller('HeaderCtrl', ['$scope', '$rootScope', '$state', 'Users', 'Auth',
  ($scope, $rootScope, $state, Users, Auth) => {
    // logout
    console.log("FDFdfgnbv", $rootScope.currentUser);
    $scope.logout = function() {
      Users.logout(function(err, res) {
        console.log(res);
        if (!err) {
          delete $rootScope.currentUser;
          Auth.logout();
          $state.go('login');
        } else {
          console.log(err, res);
        }
      });
    };

  }]);
