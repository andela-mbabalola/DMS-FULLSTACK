angular.module('Doccy.controllers')
  .controller('LoginCtrl', ['$rootScope', '$scope', '$state', 'Users', 'Auth',
    'facebook', '$log', 'google', 'modal', ($rootScope, $scope, $state, Users, Auth, facebook, $log, google,modal) => {
      //login
      $scope.login = () => {
        console.log($scope.user, "here is the scope");
        Users.login($scope.user, (err, res) => {
          console.log(res);
          if (!err) {
            Auth.setToken(res.token);
            $rootScope.currentUser = res.user;
            console.log($rootScope.currentUser, 'root scope of the current user');
            $state.go('userProfile', {
              id: $rootScope.currentUser._id
            });
          } else {
            $scope.messageLogin = err.error || err || err[0].message;
          }
        });
      };

      function authenticateOrCreateUser(res, social) {
        var social_id = social === 'google' ? 'google_id' : 'facebook_id',
          picture = typeof(res.picture) == 'object' ? res.picture.data.url : res.picture,
          user = {
            firstName: res.given_name || res.first_name,
            lastName: res.family_name || res.last_name,
            email: res.email,
            img_url: picture
          };
        user[social_id] = res.id;
        $log.debug(user);

        $scope.$apply(function(){
          user.type = social;
          $rootScope.currentUser = user;
          console.log($rootScope.currentUser);
        });
        Users.login(user, function(err, resp){
          if(err)
          {
            console.log(err);
            return modal();
          }

            $rootScope.currentUser = resp.user;
            Auth.setToken(resp.token);
            $state.go('userProfile', {
              id: resp.user._id
            });
        });

      }
      $scope.facebookLogin = function() {
        facebook.login((err, user) => {
          $log.debug(user, 'facebook');
          if (!err) {
            return authenticateOrCreateUser(user, 'facebook');
          }
        });
      };
      $scope.googleLogin = function() {
        google.login((err, user) => {
          if (!err) {
            authenticateOrCreateUser(user, 'google');
          }
        });
      };
    }
  ]);
