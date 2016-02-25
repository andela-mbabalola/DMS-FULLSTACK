(function() {
  'use strict';

  angular.module('Doccy.controllers')
    .controller('LoginCtrl', ['$rootScope', '$scope', '$state', '$mdToast',
     'Users', 'Auth','facebook', '$log', 'google', 'modal',
      function($rootScope, $scope, $state, $mdToast, Users, Auth,
         facebook, $log, google, modal) {
        //login
        $scope.login = function() {
          Users.login($scope.user, function(err, res) {
            if (!err) {
              Auth.setToken(res.token);
              $rootScope.currentUser = res.user;
              if ($rootScope.currentUser.email === 'owner@gmail.com') {
                $state.go('adminProfile', {
                  id: $rootScope.currentUser._id
                });
              } else {
                $state.go('userProfile', {
                  id: $rootScope.currentUser._id
                });
              }
            } else {
              if (err.message === 'Authentication failed. Wrong password') {
                $mdToast.show($mdToast.simple()
                  .textContent('Wrong password').hideDelay(2000));
              } else {
                $mdToast.show($mdToast.simple()
                  .textContent('Unable to log in user!').hideDelay(2000));
              }
            }
          });
        };

        function authenticateOrCreateUser(res, social) {
          var social_id = social === 'google' ? 'google_id' : 'facebook_id',
            picture = typeof(res.picture) == 'object' ?
              res.picture.data.url : res.picture,
            user = {
              firstName: res.given_name || res.first_name,
              lastName: res.family_name || res.last_name,
              email: res.email,
              img_url: picture
            };
          user[social_id] = res.id;
          $log.debug(user);
          $scope.$apply(function() {
            user.type = social;
            $rootScope.currentUser = user;
          });
          Users.login(user, function(err, resp) {
            if (err) {
              console.log(err);
              return modal.modal();
            } else {
              $rootScope.currentUser = resp.user;
              Auth.setToken(resp.token);
              $state.go('userProfile', {
                id: resp.user._id
              });
            }
          });
        }

        $scope.facebookLogin = function() {
          facebook.login(function(err, user) {
            if (!err) {
              authenticateOrCreateUser(user, 'facebook');
            }
          });
        };

        $scope.googleLogin = function() {
          google.login(function(err, user) {
            if (!err) {
              authenticateOrCreateUser(user, 'google');
            }
          });
        };
      }
    ]);
})();
