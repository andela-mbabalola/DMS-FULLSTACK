(function() {
  'use strict';

  angular.module('Doccy.controllers')
    .controller('welcomeCtrl', [
      'Documents',
      '$scope',
      'DocPreviewModal',
      function(Documents, $scope, DocPreviewModal) {
        $scope.init = function() {
          $scope.documents = Documents.query();
        };

        $scope.previewDocModal = function(ev) {
          DocPreviewModal.modal(ev, 'document', 'Preview a Document');
        };
        $scope.init();
      }
    ]);
})();
