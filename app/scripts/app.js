'use strict';

var readingRoomApp;

readingRoomApp =angular.module('readingRoomApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap'/*,
    'omr.angularFileDnD' */
  ])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })

      .when('/bookshelf', {
        templateUrl:'views/bookshelf.html',
        controller: 'BookshelfCtrl'
      })

      .when('/svg', {
        templateUrl:'views/svg.html',
        controller: 'SvgCtrl'
      })

      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });
