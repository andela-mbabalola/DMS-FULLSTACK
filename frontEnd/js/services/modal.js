angular.module('Doccy.services')
  .service('modal', ['$mdDialog', '$rootScope', 'Auth', function($mdDialog, $rootScope, Auth) {
    return function() {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'jade/modal.html',
        clickOutsideToClose: true,
        parent: angular.element(document.body),
        fullscreen: false

      });

      function DialogController($scope, $mdDialog, $state, $http, Users) {
        $http.get('/api/role/roles')
          .then(function(resp) {
            $scope.roles = resp.data;
          });
        $scope.currentUser = $rootScope.currentUser;
        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };
        $scope.signUpSocial = function(userInfo) {
          console.log(userInfo);
          userInfo.role = userInfo.role._id;
          delete userInfo.confirm_password;
          console.log(userInfo);
          Users.save(userInfo, function(resp) {
            Auth.setToken(resp.token);
            $rootScope.currentUser = resp;
            console.log($rootScope.currentUser);
            $scope.cancel();
            $state.go('userProfile', {
              id: $rootScope.currentUser.user._id
            });
          });
        };
      }
    };
  }]);
