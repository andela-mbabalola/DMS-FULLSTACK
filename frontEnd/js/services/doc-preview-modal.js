(function() {
  'use strict';

  angular.module('Doccy.services')
    .service('DocPreviewModal', function($mdToast, $mdDialog) {
      this.toast = function(msg) {
        $mdToast.show($mdToast.simple().content(msg));
      };

      this.dialog = function(title, message, event, callback) {
        $mdDialog.show(
            $mdDialog.confirm()
            .parent(angular.element(document.body))
            .clickOutsideToClose(true)
            .title(title)
            .content(message)
            .ariaLabel('Utils Dialog Service')
            .ok('OK')
            .cancel('CANCEL')
            .targetEvent(event)
          )
          .then(function() {
            if (typeof callback === 'function') {
              callback();
            }
          }, function() {});
      };

      this.modal = function(ev) {
        $mdDialog.show({
          controller: 'docpreviewCtrl',
          templateUrl: 'jade/doc-preview-modal.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          fullscreen: true
        });
      };
    })
    .controller('docpreviewCtrl',
      function($rootScope, $scope, $mdDialog) {
        $scope.currentUser = $rootScope.currentUser;

        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };
      });
})();
