(function() {
  'Use strict';

  angular.module('Doccy.controllers', []);
  angular.module('Doccy.services', []);
  angular.module('Doccy.providers', []);
  angular.module('Doccy.filters', []);
  angular.module('Doccy.directives', []);

  //require directives
  require('./directives/validatePassword');

  //require services
  require('./services/documents');
  require('./services/doc_modal');
  require('./services/user');
  require('./services/token');
  require('./services/auth');
  require('./services/tokenInjector');
  require('./services/facebook.provider');
  require('./services/google.provider');
  require('./services/modal');

  //require controllers

  // require('./controllers/footer');
  // require('./controllers/home');
  require('./controllers/header');
  require('./controllers/login');
  require('./controllers/signUp');
  require('./controllers/home');
  // require('./controllers/user-profile/index');
  require('./controllers/profile');
  require('./controllers/userProfile/documents');

  window.app = angular.module('Doccy', [
    'Doccy.controllers',
    'Doccy.services',
    'Doccy.providers',
    'Doccy.filters',
    'Doccy.directives',
    'ngRoute',
    'ui.router',
    'ngResource',
    'ngMaterial',
    'ui.tinymce',
    'ngSanitize'
  ]);

  window.app.run(['$rootScope', '$state', 'facebook', 'google', 'Users',
    ($rootScope, $state, facebook, google, Users) => {

    // Check if the user's session is still being persisted in the servers
    Users.session(function(err, res) {
      if(!err) {
        $rootScope.currentUser = res;
      }
    });

    facebook.init();
    google.init();

    $rootScope.$on('$stateChangeSuccess', (ev, to, toParams, from, fromParams) => {
      if (to.authenticate && $rootScope.currentUser) {
        $state.go(to);
      } else if (!to.authenticate) {
        $state.go(to);
      } else {
        $state.go('login');
      }
    });
    $rootScope.login = () => {
      //make a transition to login when app starts
      $state.go('login');
    };

    $rootScope.menu = [{
      name: 'Home',
      state: 'home'
    }, {
      name: 'About',
      state: 'about'
    }];

  }]);

  window.app.config(['$stateProvider', '$httpProvider', '$urlRouterProvider',
    '$mdThemingProvider', '$locationProvider', 'facebookProvider', 'googleProvider', ($stateProvider, $httpProvider, $urlRouterProvider,
      $mdThemingProvider, $locationProvider, facebookProvider, googleProvider) => {
      facebookProvider.setAppId('1704950776416059');
      googleProvider.setAppConfig({
        SCOPE: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        CLIENTID: '315009085385-3i53uqkt2o6vvou3r52ssa2f6b96hu0v.apps.googleusercontent.com',
        REDIRECT: 'http://localhost:4444',
        LOGOUT: 'http://accounts.google.com/Logout',
        TYPE: 'token'
      });

      $httpProvider.interceptors.push('TokenInjector');

      // For any unmatched url, redirect to /state1
      $urlRouterProvider.otherwise('/404');

      //setting theme for the states
      $mdThemingProvider.theme('default')
        .primaryPalette('teal')
        .accentPalette('pink');

      // Now set up the states
      $stateProvider
        .state('home', {
          url: '/',
          controller: 'HomeCtrl',
          templateUrl: 'jade/home.html',
          authenticate: false
        })
        .state('login', {
          url: '/users/login',
          controller: 'LoginCtrl',
          templateUrl: 'jade/login.html',
          authenticate: false
        })
        .state('signUp', {
          url: '/users/signUp',
          controller: 'SignUpCtrl',
          templateUrl: 'jade/signUp.html',
          authenticate: false
        })
        .state('userProfile', {
          url: '/users/profile',
          //controller: 'UserProfileCtrl',
          templateUrl: 'jade/user-profile.html',
          authenticate: true
        })
        .state('userProfile.edit', {
          url: '/{id}/edit',
          views: {
            'inner-view@userProfile': {
              controller: 'ProfileCtrl',
              templateUrl: 'jade/edit-profile.html'
            }
          },
          authenticate: true
        })
        .state('userProfile.documents', {
          url: '/documents',
          views: {
            'inner-view@userProfile': {
              controller: 'userDocumentCtrl',
              templateUrl: 'jade/user-documents.html'
            }
          },
          authenticate: true
        })
        .state('userProfile.editDocument', {
          url: '/documents/{id}/edit',
          views: {
            'inner-view@userProfile': {
              controller: 'userDocumentCtrl',
              templateUrl: 'jade/edit-documents.html'
            }
          }
        })
        .state('welcome', {
          url: '/users/welcome',
          //controller: 'welcomeCtrl',
          templateUrl: 'jade/welcome.html',
          authenticate: false
        })
        .state('404', {
          url: '/404',
          templateUrl: 'jade/404.html',
          authenticate: false
        });

      $locationProvider.html5Mode(true);
    }
  ]);

})();
