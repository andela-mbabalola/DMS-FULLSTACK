(function() {
  'use strict';

  angular.module('Doccy.controllers')
    .controller('HeaderCtrl', ['$scope', '$rootScope',
      '$state', 'Auth',
      function($scope, $rootScope, $state, Auth) {
        // logout
        $scope.logout = function() {
            delete $rootScope.currentUser;
              Auth.logout();
              $state.go('login');
      };
    }]);
})();
