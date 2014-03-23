'use strict';

angular.module('readingRoomApp')
  .directive('intOnly', function () {
    /*
    return {
      restrict: 'A',
      require: '^ngModel',
      link: function (scope, element, attrs, ngModel) {
        if (!ngModel) return;
        ngModel.$parsers.unshift(function (inputValue) {
          var digits = inputValue.split('').filter(
            function (s) {
              return (!isNaN(s) && s != ' ');
            }).join('');

          ngModel.$viewValue = digits;
          ngModel.$render();
          return digits;
        });
      }
    };
    */
    return {
      restrict: 'A',
      require: '^ngModel',
      link: function(scope, element, attrs, ngModelCtrl) {
        if(!ngModelCtrl) {
          return;
        }

        ngModelCtrl.$parsers.push(function(val) {
          var clean = val.replace( /[^0-9]+/g, '');
          if (val !== clean) {
            ngModelCtrl.$setViewValue(clean);
            ngModelCtrl.$render();
          }
          return clean;
        });

        element.bind('keypress', function(event) {
          if(event.keyCode === 32) {
            event.preventDefault();
          }
        });
      }
    };
  });
