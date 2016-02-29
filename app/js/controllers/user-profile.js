(function() {
  'use strict';

  angular.module('Doccy.controllers')
    .controller('UserProfileCtrl', [
      '$rootScope',
      '$scope',
      function($rootScope, $scope) {

        $scope.admin = function() {
          if ($rootScope.currentUser.email === 'owner@gmail.com') {
            return true;
          } else {
            return false;
          }
        };
      }
    ]);
})();
