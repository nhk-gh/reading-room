'use strict';

angular.module('readingRoomApp')
  .directive('setFocus', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        attrs.$observe('setFocus', function (value) {
          if (value === 'true') {
            $timeout(function() {
              element[0].focus();
            }, 5);
          }
        });
      }
    };
  }]);
