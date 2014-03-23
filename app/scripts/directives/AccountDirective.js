'use strict';

angular.module('readingRoomApp').directive('loginDlg', function () {
    return {
      templateUrl: 'views/login.html',
      restrict: 'E'
    };
  });

angular.module('readingRoomApp').directive('logoutDlg', function () {
    return {
      templateUrl: 'views/logout.html',
      restrict: 'E'
    };
  });

angular.module('readingRoomApp').directive('registerDlg', function () {
    return {
      templateUrl: 'views/register.html',
      restrict: 'E'
    };
  });

angular.module('readingRoomApp').directive('reminderDlg', function () {
    return {
      templateUrl: 'views/passwordReminder.html',
      restrict: 'E'
    };
  });
