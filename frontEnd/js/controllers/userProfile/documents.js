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
      function($scope, $rootScope, $state, Users, DocModal, Documents, $stateParams, $sce, $mdToast, $mdDialog) {

        $scope.init = function() {
          Documents.get({
            id: $stateParams.id
          }, function(res) {
            $scope.docs = res.doc;
            console.log($stateParams.id);
          });

          Users.userDocs($rootScope.currentUser, function(err, res) {
            console.log(res, 'here');
            if (err) {
              $scope.message = 'Your Documents goes here.';
            } else {
              $scope.documents = res;
              if (res.doc.length === 0) {
                $scope.message = 'Your Documents goes here.';
              }
            }
            $scope.userDocs = res.doc.map(function(obj) {
              console.log(obj.content);
              obj.content = $sce.trustAsHtml(obj.content);
              return obj;
            });
            console.log($scope.userDocs);
          });
        };

        // create event
        $scope.addDocument = function() {
          var userInfo = {
            role: $rootScope.currentUser.role,
            email: $rootScope.currentUser.email
          };
          angular.extend($scope.document, userInfo);
          Documents.save($scope.document, function(doc) {
            if (doc) {
              $state.go('userProfile.documents', {
                id: doc.id
              });
            } else {
              DocModal.toast('Document not created');
            }
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

        $scope.editDocument = function() {
          Documents.update($scope.docs, function() {
            console.log($scope.docs, 'im here');
            $scope.message =
              'You have successfully updated your document.';
          }, function(err) {
            console.log(err, 'here');
            $scope.message =
              'There was a problem updating your document.';
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
