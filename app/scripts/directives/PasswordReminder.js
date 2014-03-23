'use strict';

angular.module('readingRoomApp').directive('passwordReminder',
  function($log, $timeout){
    return {
      restrict: 'A',

      link: function(scope, element){
        //initial state
        $timeout(function(){
          element.find('#radio1').prop('checked', true);
          element.find('label#lbl-fullname').css('display', 'none');
          scope.$parent.lookfor = 'username';
        }, 200);

        element.find('#radio1').on('click', function(){
          element.find('label#lbl-username').css('display', 'block');
          element.find('label#lbl-fullname').css('display', 'none');
        });

        element.find('#radio2').on('click', function(){
          element.find('label#lbl-username').css('display', 'none');
          element.find('label#lbl-fullname').css('display', 'block');
        });
      }
    };
  });
