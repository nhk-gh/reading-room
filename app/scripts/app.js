'use strict';

var readingRoomApp;
//'ngPDFViewer',

readingRoomApp = angular.module('readingRoomApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap'
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

      .when('/book/:ind/:chapter', {
        templateUrl:'views/book.html',
        controller: 'BookCtrl'
      })

      .otherwise({
        redirectTo: '/'
      });

    //$locationProvider.html5Mode(true);
  });
