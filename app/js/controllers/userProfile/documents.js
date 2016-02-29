(function() {
  'use strict';

  angular.module('Doccy.controllers')
    .controller('userDocumentCtrl', [
      '$scope',
      '$rootScope',
      '$state',
      'Users',
      'DocModal',
      'Documents',
      '$stateParams',
      '$sce',
      '$mdToast',
      '$mdDialog',
      function($scope, $rootScope, $state, Users, DocModal, Documents,
        $stateParams, $sce, $mdToast, $mdDialog) {

        $scope.init = function() {
          console.log($stateParams.id);
          if($stateParams.id){
          Documents.get({
            id: $stateParams.id
          }, function(res) {
            $scope.docs = res.doc;
          });
        }

          Users.userDocs($rootScope.currentUser, function(err, res) {
            console.log(res, 'here');
            if (!err) {
              $scope.userDocs = res.doc.map(function(obj) {
                obj.content = $sce.trustAsHtml(obj.content);
                return obj;
              });
            }
          });
        };

        // create event
        $scope.addDocument = function() {
          var userInfo = {
            role: $rootScope.currentUser.role,
            ownerId: $rootScope.currentUser._id
          };
          angular.extend($scope.document, userInfo);
          Documents.save($scope.document, function(doc) {
            console.log(doc);
            $state.go('userProfile.documents', {
              id: $rootScope.currentUser._id,

            }, {
              reload: true
            });
            $mdDialog.cancel();
          }, function(err) {
            console.log(err);
            DocModal.toast('Document not created');
          });
        };

        $scope.addDocumentModal = function(ev) {
          DocModal.modal(ev, 'document', 'Create a Document');
        };

        $scope.tinymceOptions = {
          inline: false,
          plugins: 'advlist autolink link image lists charmap print preview',
          skin: 'lightgray',
          theme: 'modern'
        };

        $scope.getADoc = function() {
          Documents.get({
            id: $stateParams.id
          }, function(res) {
            $scope.docs = res.doc;
          });
        };

        $scope.editDocument = function() {
          Documents.update($scope.docs, function() {
            $mdToast.show($mdToast.simple()
              .textContent('Update successful').hideDelay(2000));
            $state.go('userProfile.documents', {
              id: $rootScope.currentUser._id
            }, {
              reload: true
            });
          }, function() {
            $mdToast.show($mdToast.simple()
              .textContent('Error updating profile').hideDelay(2000));
          });
        };

        $scope.deleteUserDoc = function(ev, doc) {
          var confirm = $mdDialog.confirm()
            .title('Confirm if you want to delete the document?!')
            .textContent('Once deleted, the document, ' +
              'cannot be retrieved!')
            .ariaLabel('Delete Document')
            .targetEvent(ev)
            .ok('Delete')
            .cancel('Cancel');
          $mdDialog.show(confirm).then(function() {
            Documents.remove({
              id: doc._id
            }, function() {
              $mdToast.show($mdToast.simple()
                .textContent('Document Deleted').hideDelay(2000));
              $state.go('userProfile.documents', {
                id: $rootScope.currentUser._id
              }, {
                reload: true
              });
            });
          }, function() {
            $mdToast.show($mdToast.simple()
              .textContent('Document Retained').hideDelay(2000));
          });
        };
        $scope.init();
      }
    ]);
})();
