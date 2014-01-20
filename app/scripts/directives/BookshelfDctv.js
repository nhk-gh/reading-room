'use strict';

angular.module('readingRoomApp')
  .directive('dnd', function ($log) {
    return {
      restrict: 'A',
      link: function(scope, el, attrs) {
        scope.files=[];

        el.dropzone({
          url: '/file-upload',
          maxFilesize: 25,
          init: function() {
            scope.files.push({file: 'added'});

            this.on('success', function(file, json) {
            });
            this.on('addedfile', function(file) {
              scope.$apply(function() {
                scope.files.push({file: file});//'added'});
              });
            })
            .on('success', function(e, data){
                $log.info(e);
                alert(data);
            });
          }
        });
      }
    };
  });
