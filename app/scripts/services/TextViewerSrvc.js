'use strict';

angular.module('readingRoomApp')
  .factory('TextViewerSrvc', function() {
    return {
      getDocument: function(){},

      instance: function(id) {
        var instanceId = id;

        return {
          prevPage: function() {
            $rootScope.$broadcast('pdfviewer.prevPage', instanceId);
          },

          nextPage: function() {
            $rootScope.$broadcast('pdfviewer.nextPage', instanceId);
          },

          gotoPage: function(page) {
            $rootScope.$broadcast('pdfviewer.gotoPage', instanceId, page);
          },

          zoomIn: function() {
            $rootScope.$broadcast('pdfviewer.zoomIn');
          },

          zoomOut: function() {
            $rootScope.$broadcast('pdfviewer.zoomOut');
          }
        };
      }
    }
  });
