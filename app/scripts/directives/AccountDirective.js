'use strict';

angular.module('readingRoomApp')
  .directive('loginDlg', function () {
    return {
      templateUrl: 'views/login.html',
      restrict: 'E'

    };
  });
