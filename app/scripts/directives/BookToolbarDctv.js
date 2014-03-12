'use strict';

angular.module('readingRoomApp')
  .directive('bookToolbar', function ($log) {
    return {
      templateUrl: '../../views/booktoolbar.html',
      restrict: 'E',
      replace: true,
      link: function postLink(scope, element, attrs) {
        $log.info(element)
      }
    };
  });
