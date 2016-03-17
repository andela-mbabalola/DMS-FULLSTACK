(function() {
  'use strict';

  angular.module('Doccy.services')
    .service('modal', function($mdToast, $mdDialog) {
      this.toast = function(msg) {
        $mdToast.show($mdToast.simple().content(msg));
      };
      this.modal = function() {
        $mdDialog.show({
          controller: 'DialogController',
          templateUrl: 'jade/modal.html',
          clickOutsideToClose: true,
          parent: angular.element(document.body),
          fullscreen: false
        });
      };
    })
    .controller('DialogController',
      function($scope, $mdDialog, $state, $http, Users, $rootScope, Auth) {
        $scope.init = function() {
          $http.get('/api/role/roles')
            .then(function(resp) {
              $scope.roles = resp.data;
            });
        };

        $scope.currentUser = $rootScope.currentUser;
        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };
        $scope.signUpSocial = function(userInfo) {
          userInfo.role = userInfo.role._id;
          delete userInfo.confirm_password;
          Users.save(userInfo, function(resp) {
            Auth.setToken(resp.token);
            $rootScope.currentUser = resp;
            $scope.cancel();
            $state.go('userProfile', {
              id: $rootScope.currentUser.user._id
            });
          });
        };
        $scope.init();
      });
})();
