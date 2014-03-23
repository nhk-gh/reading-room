'use strict';

angular.module('readingRoomApp')
  .directive('bookToolbar', function () {
    return {
      templateUrl: 'views/booktoolbar.html',
      restrict: 'E',
      replace: true
    };
  });
