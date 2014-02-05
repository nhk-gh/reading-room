'use strict';

angular.module('readingRoomApp')
  .directive('fadeMenu', function ($log) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        var menu = element.find('.hidden');

        element.on("mouseenter", function(){
            menu.removeClass('hidden');
            menu.css('position','absolute');
            menu.css('left','80%');
            menu.css('top','0');
            menu.css('color','red');
          })
          .on("mouseleave", function(){
            menu.addClass('hidden');
          });

        menu.on("click", function(){
          singlePhotoService.deletePhoto({id:scope.photoid})
            .then(function(){
              $route.reload();
            },
            function(status){
              $log.warn(status);
            });
          })
          .on("mouseenter", function(){
            menu.css('opacity','1');
          })
          .on("mouseleave", function(){
            menu.css('opacity','0.2');
          });
      }
    };
  });
