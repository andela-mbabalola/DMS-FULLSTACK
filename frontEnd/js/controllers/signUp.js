angular.module('Doccy.controllers')
  .controller('SignUpCtrl', ['$rootScope', '$scope', '$http', '$state', 'Users', 'Auth',
   ($rootScope, $scope, $http, $state, Users, Auth) => {

     $http.get('/api/role/roles')
       .then(function(resp){
         $scope.roles = resp.data;
       });
    //signUp
    $scope.signUp = () => {
      var user = {
        email: $scope.user.email,
        password: $scope.user.password,
        role: $scope.user.role._id
      };

      Users.save(user, (res) => {
        Auth.setToken(res.token);
        $rootScope.currentUser = res;
        console.log('$rootScope.currentUser: ', $rootScope.currentUser);
        console.log($rootScope.currentUser.user._id, 'Here knsfsgjgh,gfnv,xf');
        $state.go('userProfile', {
          id: $rootScope.currentUser.user._id
        });
      }, (err) => {
        console.log(err);
      });
    };
  }]);
