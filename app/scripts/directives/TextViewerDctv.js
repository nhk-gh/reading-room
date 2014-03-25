'use strict';

angular.module('readingRoomApp')
  .directive('txtviewer', function (TextViewerSrvc) {
    var canvas = null;
    var instanceId = null;
    var viewer = null;


    return {
      restrict: 'EA',
      template: '<p></p>',
      scope: {
        onPageLoad: '&',
        src: '@',
        id: '='
      },
      controller: [ '$scope', function($scope) {
        $scope.pageNum = 1;
        $scope.txtDoc = null;
        $scope.scale = 1.0;
        var scaleStep = 0.2;

        $scope.loadTXT = function(path) {
          console.log('loadTXT ', path);
          TextViewerSrvc.getDocument(path).then(function(_txtDoc) {
            $scope.txtDoc = _txtDoc;
            $scope.renderPage($scope.pageNum);
          });
        };

        $scope.renderPage = function(num, callback) {
          var viewport = {width:612, height:792};
          var ctx = canvas.getContext('2d');

          canvas.height = viewport.height * $scope.scale;
          canvas.width = viewport.width * $scope.scale;
          viewer.height = viewport.height * $scope.scale;
          viewer.width = viewport.width * $scope.scale;

          ctx.fillText($scope.txtDoc[num-1], 10, 10);

          $scope.$apply(function() {
            $scope.onPageLoad({ page: $scope.pageNum, total: $scope.txtDoc.numPages });
          });
        };

        $scope.$on('txtviewer.nextPage', function(evt, id) {
          if (id !== instanceId) {
            return;
          }

          if ($scope.pageNum < $scope.txtDoc.numPages) {
            $scope.pageNum++;
            $scope.renderPage($scope.pageNum);
          }
        });

        $scope.$on('txtviewer.prevPage', function(evt, id) {
          if (id !== instanceId) {
            return;
          }

          if ($scope.pageNum > 1) {
            $scope.pageNum--;
            $scope.renderPage($scope.pageNum);
          }
        });

        $scope.$on('txtviewer.gotoPage', function(evt, id, page) {
          if (id !== instanceId) {
            return;
          }

          if (page >= 1 && page <= $scope.txtDoc.numPages) {
            $scope.pageNum = page;
            $scope.renderPage($scope.pageNum);
          }
        });

        $scope.$on('txtviewer.zoomIn', function() {
          if ($scope.scale < 2) {
            $scope.scale += scaleStep;
            $scope.renderPage($scope.pageNum);
          }
        });

        $scope.$on('txtviewer.zoomOut', function() {
          if ($scope.scale > 1) {
            $scope.scale -= scaleStep;
            $scope.renderPage($scope.pageNum);
          }
        });
      }],


      link: function(scope, iElement, iAttr) {
        canvas = iElement.find('canvas')[0];
        instanceId = iAttr.id;

        viewer = angular.element('#viewer');

        iAttr.$observe('src', function(v) {
          console.log('src attribute changed, new value is', v);
          if (v !== undefined && v !== null && v !== '') {
            scope.pageNum = parseInt(iAttr.page);
            scope.loadTXT(scope.src);
          }
        });
      }
    };
  });
