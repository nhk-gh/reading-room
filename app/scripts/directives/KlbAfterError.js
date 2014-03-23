'use strict';

angular.module('readingRoomApp').directive('klbAfterError',function(){
  return {
    restrict: 'A',

    link: function(scope, element) {
      var inputs = element.find('input');

      inputs.on('keypress', function() {
        $(this).css('border-color','');
      });
    }
  };

});
