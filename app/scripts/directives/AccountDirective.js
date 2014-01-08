'use strict';

angular.module('readingRoomApp')
  .directive('loginDlg', function () {
    return {
      templateUrl: 'views/login.html',
      restrict: 'E'
    };
  });

readingRoomApp.directive('registerDlg', function () {
    return {
      templateUrl: 'views/register.html',
      restrict: 'E'
    };
  });

readingRoomApp.directive('reminderDlg', function () {
    return {
      templateUrl: 'views/passwordReminder.html',
      restrict: 'E'
    };
  });
