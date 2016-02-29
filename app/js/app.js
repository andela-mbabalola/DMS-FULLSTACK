(function() {
  'use strict';

  angular.module('Doccy.controllers', []);
  angular.module('Doccy.services', []);
  angular.module('Doccy.providers', []);
  angular.module('Doccy.directives', []);

  //require services
  require('./services/role');
  require('./services/doc-preview-modal');
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
  require('./controllers/header');
  require('./controllers/welcome');
  require('./controllers/login');
  require('./controllers/signUp');
  require('./controllers/adminPanel');
  require('./controllers/profile');
  require('./controllers/user-profile');
  require('./controllers/userProfile/documents');

  //require directives
  require('./directives/validatePassword');

  window.app = angular.module('Doccy', [
    'Doccy.controllers',
    'Doccy.services',
    'Doccy.providers',
    'Doccy.directives',
    'ngRoute',
    'ui.router',
    'ngResource',
    'ngMaterial',
    'ui.tinymce',
    'ngSanitize',
    'ngFileUpload',
    'md.data.table',
    'cloudinary'
  ]);

  window.app.run(['$rootScope', '$state', 'Users', 'facebook', 'google',
    function($rootScope, $state, Users, facebook, google) {

    // Check if the user's session is still being persisted in the servers
    Users.session(function(err, res) {
      if(!err) {
        $rootScope.currentUser = res;
      }
    });

    facebook.init();
    google.init();

    $rootScope.$on('$stateChangeSuccess', function(ev, to)  {
      if (to.authenticate && $rootScope.currentUser) {
        $state.go(to);
      } else if (!to.authenticate) {
        $state.go(to);
      } else {
        $state.go('login');
      }
    });
    $rootScope.login = function()  {
      //make a transition to login when app starts
      $state.go('login');
    };


  }]);

  window.app.config(['$stateProvider', '$httpProvider', '$urlRouterProvider',
    '$mdThemingProvider', '$locationProvider', 'facebookProvider', 'googleProvider', 'cloudinaryProvider', function($stateProvider, $httpProvider, $urlRouterProvider,
      $mdThemingProvider, $locationProvider, facebookProvider, googleProvider,cloudinaryProvider) {
      facebookProvider.setAppId('1704950776416059');
      googleProvider.setAppConfig({
        SCOPE: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        CLIENTID: '315009085385-3i53uqkt2o6vvou3r52ssa2f6b96hu0v.apps.googleusercontent.com',
        REDIRECT: 'http://localhost:4444',
        LOGOUT: 'http://accounts.google.com/Logout',
        TYPE: 'token'
      });

      cloudinaryProvider
        .set('cloud_name', 'yhemmy')
        // .set('api_key', '522572236687386');
        // .set('api_secret', 'esRg6uORoctFUgFeFZanHxcxp4o');
        .set('upload_preset', 'wte4adrf');

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
        .state('adminProfile', {
          url: '/users/admin',
          controller: 'AdminPanelController',
          templateUrl: 'jade/admin-panel.html',
          authenticate: true
        })
        .state('userProfile', {
          url: '/users/profile',
          controller: 'UserProfileCtrl',
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
          controller: 'welcomeCtrl',
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
