angular.module('starter', ['ionic', 'firebase', 'starter.controllers', 'starter.services'])

.run(function($rootScope, $templateCache, $ionicPlatform) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

    $rootScope.$on('$viewContentLoaded', function () {
      $templateCache.removeAll();
    })

  })
})

.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', function($httpProvider, $stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('login', {
    url: '/',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('tab.login', {
    url: '/login',
    views: {
      'tab-login': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })
  // setup an abstract state for the tabs directive
  .state('redirect', {
    url: '/&__firebase_request_key=:requestkey',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl',
    data: {
       requiresLogin: false
    }
  })

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'LandingCtrl'
  })

  .state('tab.home', {
    url: '/:userId/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/landing.html',
        controller: 'LandingCtrl',
        access: {
            requiresLogin: true
        }
      }
    }
  })

  .state('tab.explore', {
    url: '/:userId/explore',
    views: {
      'tab-explore': {
        templateUrl: 'templates/explore.html',
        controller: 'ExploreCtrl',
        access: {
          requiresLogin: true
        }
      }
    }
  })

  .state('tab.wishlist', {
    url: '/:userId/wishlist',
    views: {
      'tab-wishlist': {
        templateUrl: 'templates/wishlist.html',
        controller: 'WishlistCtrl',
        access: {
          requiresLogin: true
        }
      }
    }
  })

  .state('tab.social', {
    url: '/:userId/social',
    views: {
      'tab-social': {
        templateUrl: 'templates/social.html',
        controller: 'SocialCtrl',
        access: {
          requiresLogin: true
        }
      }
    }
  })

  .state('tab.search', {
    url: '/:userId/search',
    views: {
      'tab-search': {
        templateUrl: 'templates/search.html',
        controller: 'SearchCtrl',
        access: {
          requiresLogin: true
        }
      }
    }
  });

  $urlRouterProvider.otherwise('/');

}]);
