(function() {
  'use strict';

  angular.module('Doccy.controllers')
    .controller('AdminPanelController', [
      'Users',
      'Documents',
      //'Roles',      '$scope',
      '$mdDialog',
      '$mdToast', function(Users, Documents, $scope, $mdDialog, $mdToast) {

        $scope.init = function() {
          Documents.query(function(res) {
            $scope.documents = res;
          });
          Users.query(function(res) {
            $scope.users = res;
          });
          //$scope.roles = Roles.query();
        };

        $scope.deleteUser = function(ev, user) {
          var confirm = $mdDialog.confirm()
            .title('Confirm if you want to delete the user?!')
            .textContent('Once deleted, the user, ' +
              'cannot be retrieved!')
            .ariaLabel('Delete User')
            .targetEvent(ev)
            .ok('Delete')
            .cancel('Cancel');
          $mdDialog.show(confirm).then(function() {
            Users.remove({
              id: user._id
            }, function() {
              $mdToast.show($mdToast.simple()
                .textContent('User Deleted').hideDelay(2000));
            });
          }, function() {
            $mdToast.show($mdToast.simple()
              .textContent('User Retained').hideDelay(2000));
          });
        };

        // $scope.deleteRole = function(ev, role) {
        //   var confirm = $mdDialog.confirm()
        //     .title('Confirm if you want to delete the role?!')
        //     .textContent('Once deleted, the role, ' +
        //       'cannot be retrieved!')
        //     .ariaLabel('Delete Role')
        //     .targetEvent(ev)
        //     .ok('Delete')
        //     .cancel('Cancel');
        //   $mdDialog.show(confirm).then(function() {
        //     Roles.remove({
        //       id: role._id
        //     }, function() {
        //       $mdToast.show($mdToast.simple()
        //         .textContent('Role Deleted').hideDelay(2000));
        //     });
        //   }, function() {
        //     $mdToast.show($mdToast.simple()
        //       .textContent('Role Retained').hideDelay(2000));
        //   });
        // };

        $scope.deleteDocument = function(ev, document) {
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
              id: document._id
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
