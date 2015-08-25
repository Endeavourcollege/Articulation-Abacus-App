// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'firebase', 'n3-pie-chart', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  
  .state('login', {
    url: '/mainlogin',
    templateUrl: 'templates/mainlogin.html',
    controller: 'AppCtrl'
  })
  
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  
  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html'
      }
    }
  })
  
  .state('app.createaccount', {
    url: '/createaccount',
    views: {
      'menuContent': {
        templateUrl: 'templates/createaccount.html'
      }
    }
  })
  
  .state('app.demo', {
    url: '/demo',
    views: {
      'menuContent': {
        templateUrl: 'templates/abacusdemo.html'
      }
    }
  })
  
  .state('app.account', {
    url: '/account',
    views: {
      'menuContent': {
        templateUrl: 'templates/account.html'
      }
    }
  })
  
  .state('app.abacushistory', {
    url: '/abacushistory',
    views: {
      'menuContent': {
        templateUrl: 'templates/abacushistory.html'
      }
    }
  })
  
  .state('app.abacushistoryitem', {
    url: '/abacushistory/:abacusId',
    views: {
      'menuContent': {
        templateUrl: 'templates/abacushistoryitem.html'
      }
    }
  })
  
  .state('app.abacus', {
    url: '/abacus',
    views: {
      'menuContent': {
        templateUrl: 'templates/abacus.html'
      }
    }
  })
  
  .state('app.svg', {
    url: '/svg',
    views: {
      'menuContent': {
        templateUrl: 'templates/animatedsvg.html'
      }
    }
  });
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/mainlogin');
});