'use strict';

angular.module('readingRoomApp')
  .directive('fadeMenu', function () {
    return {
      restrict: 'A',
      link: function(scope, element) {
        var menu = element.find('.book-menu');

        element.on('mouseenter', function(){
          menu.fadeIn();
        })
        .on('mouseleave', function(){
          menu.fadeOut();
        });

        /*menu.on('click', function(){

        })
        .on('mouseenter', function(){
          menu.css('opacity','1');
        })
        .on('mouseleave', function(){
          menu.css('opacity','0.5');
        }); */
      }
    };
  });
