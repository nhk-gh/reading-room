'use strict';

angular.module('readingRoomApp')
  .directive('pdfviewer',['$rootScope', function($rootScope) {
    var canvas = null;
    var instanceId = null;
    var viewer = null;


    return {
      restrict: 'EA',
      template: '<canvas></canvas>',
      scope: {
        onPageLoad: '&',
        loadProgress: '&',
        src: '@',
        id: '='
      },
      controller: [ '$scope', 'SCALE', function($scope, SCALE) {
        $scope.pageNum = 1;
        $scope.pdfDoc = null;
        $scope.scale = SCALE.INITIAL_SCALE;
        var scaleStep = 0.2;

        $scope.documentProgress = function(progressData) {
          if ($scope.loadProgress) {
            $scope.loadProgress({state: 'loading', loaded: progressData.loaded, total: progressData.total});
          }
        };

        $scope.loadPDF = function(path) {
          console.log('loadPDF ', path);
          PDFJS.getDocument(path, null, null, $scope.documentProgress).then(function(_pdfDoc) {
            $scope.pdfDoc = _pdfDoc;
            $scope.renderPage($scope.pageNum, function() {
              if ($scope.loadProgress) {
                $scope.loadProgress({state: 'finished', loaded: 0, total: 0});
              }
            });
          }, function(message) {
            console.log('PDF load error: ' + message);
            if ($scope.loadProgress) {
              $scope.loadProgress({state: 'error', loaded: 0, total: 0});
            }
          });
        };

        $scope.renderPage = function(num, callback) {
          //console.log('renderPage ', num);
          $scope.pdfDoc.getPage(num).then(function(page) {
            var viewport = page.getViewport($scope.scale);
            var ctx = canvas.getContext('2d');

            canvas.height = viewport.height;
            canvas.width = viewport.width;
            viewer.height = viewport.height;
            viewer.width = viewport.width;

            page.render({ canvasContext: ctx, viewport: viewport }).promise.then(
              function() {
                if (callback) {
                  callback(true);
                }
                $scope.$apply(function() {
                  $scope.onPageLoad({ page: $scope.pageNum, total: $scope.pdfDoc.numPages });
                });
              },
              function() {
                if (callback) {
                  callback(false);
                }
                console.log('page.render failed');
              }
            );
          });
        };

        $scope.$on('pdfviewer.nextPage', function(evt, id) {
          if (id !== instanceId) {
            return;
          }

          if ($scope.pageNum < $scope.pdfDoc.numPages) {
            $scope.pageNum++;
            $scope.renderPage($scope.pageNum);
          }
        });

        $scope.$on('pdfviewer.prevPage', function(evt, id) {
          if (id !== instanceId) {
            return;
          }

          if ($scope.pageNum > 1) {
            $scope.pageNum--;
            $scope.renderPage($scope.pageNum);
          }
        });

        $scope.$on('pdfviewer.gotoPage', function(evt, id, page) {
          if (id !== instanceId) {
            return;
          }

          if (page >= 1 && page <= $scope.pdfDoc.numPages) {
            $scope.pageNum = page;
            $scope.renderPage($scope.pageNum);
          }
        });

        $scope.$on('pdfviewer.zoomIn', function() {
          if ($scope.scale < SCALE.MAX_SCALE) {
            $scope.scale += scaleStep;
            $scope.renderPage($scope.pageNum);
            $rootScope.$broadcast('pdfviewer.zoomChanged', $scope.scale);
          }

        });

        $scope.$on('pdfviewer.zoomOut', function() {
          if ($scope.scale > SCALE.MIN_SCALE) {
            $scope.scale -= scaleStep;
            $scope.renderPage($scope.pageNum);
            $rootScope.$broadcast('pdfviewer.zoomChanged', $scope.scale);
          }
        });

      } ],


      link: function(scope, iElement, iAttr) {
        canvas = iElement.find('canvas')[0];
        instanceId = iAttr.id;

        viewer = angular.element('#viewer');

        iAttr.$observe('src', function(v) {
          console.log('src attribute changed, new value is', v);
          if (v !== undefined && v !== null && v !== '') {
            scope.pageNum = parseInt(iAttr.page);
            scope.loadPDF(scope.src);
          }
        });
      }
    };
  }]);

angular.module('readingRoomApp')
  .service('PDFViewerService', [ '$rootScope', function($rootScope) {

    var svc = { };
    /*
    svc.nextPage = function() {
      $rootScope.$broadcast('pdfviewer.nextPage');
    };

    svc.prevPage = function() {
      $rootScope.$broadcast('pdfviewer.prevPage');
    };
    */
    svc.Instance = function(id) {
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
    };

    return svc;
  }]);
