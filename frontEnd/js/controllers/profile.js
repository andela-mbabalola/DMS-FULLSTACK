(function() {
  'use strict';

  angular.module('Doccy.controllers')
    .controller('ProfileCtrl', [
      '$scope',
      '$rootScope',
      '$state',
      'Users',
      '$http',
      'cloudinary',
      'Upload',
      '$mdToast',
      function($scope, $rootScope, $state, Users, $http,
        cloudinary, $upload, $mdToast) {

        var date = new Date();
        $scope.title = 'Img (' + date.getDate() + ' - ' + date.getHours() +
          ':' + date.getMinutes() + ':' + date.getSeconds() + ')';

        $http.get('/api/role/roles')
          .then(function(resp) {
            $scope.roles = resp.data;
          });

        $scope.uploadProfilePic = function(file) {
          $scope.file = file;
          if (!$scope.file) {
            return;
          } else {
            if (file && !file.error) {
              console.log(cloudinary.config().upload_preset, 'here');
              file.upload = $upload.upload({
                url: 'https://api.cloudinary.com/v1_1/' +
                  cloudinary.config().cloud_name + '/upload',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded; ' +
                    'charset=UTF-8'
                },

                data: {
                  upload_preset: cloudinary.config().upload_preset,
                  tags: 'profilePic',
                  context: 'photo=' + $scope.title,
                  file: file
                },
              }).progress(function(e) {
                $scope.progress = Math.round((e.loaded * 100.0) / e.total);
                $scope.isUploading = 'Uploading... ' + $scope.progress + '%';
              }).success(function(data) {
                $rootScope.currentUser.img_url = data.url;
                $scope.editProfile();
              }).error(function(err) {
                console.log(err);
              });
            }
          }
        };

        $scope.editProfile = function() {
          Users.update($rootScope.currentUser, function() {
            $mdToast.show($mdToast.simple()
              .textContent('Profile successfully updated').hideDelay(2000));
            $state.go('userProfile.edit', {
              id: $rootScope.currentUser._id
            }, {
              reload: true
            });
          }, function(err) {
            console.log(err);
            $mdToast.show($mdToast.simple()
              .textContent('Unable to update profile').hideDelay(2000));
          });
        };
      }
    ]);
})();
