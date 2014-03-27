'use strict';

angular.module('readingRoomApp')
  .directive('txtviewer', function (TextViewerSrvc, SCALE) {
    var canvas = null;
    var instanceId = null;
    var viewer = null;


    return {
      restrict: 'EA',
      template: '<canvas></canvas>',
      scope: {
        onPageLoad: '&',
        src: '@',
        id: '='
      },
      controller: [ '$scope', function($scope) {
        $scope.pageNum = 1;
        $scope.txtDoc = null;
        $scope.scale = SCALE.INITIAL_SCALE;

        $scope.loadTXT = function(path) {
          console.log('loadTXT ', path);
          TextViewerSrvc.getDocument(path).then(function(_txtDoc) {
            $scope.txtDoc = _txtDoc.book;
            $scope.renderPage($scope.pageNum);
          });
        };

        $scope.renderPage = function(num/*, callback*/) {
          var viewport = {width:612, height:792};
          var fontSize = 10;
          var lnX = 60 * $scope.scale;
          var lnY = 60 * $scope.scale;
          var lnH = 14 * $scope.scale;
          var fitWidth = (viewport.width-50) * $scope.scale;

          var ctx = canvas.getContext('2d');

          canvas.height = viewport.height * $scope.scale;
          canvas.width = viewport.width * $scope.scale;
          viewer.height = viewport.height * $scope.scale;
          viewer.width = viewport.width * $scope.scale;

          ctx.font= fontSize * $scope.scale +"px sans-serif";
          ctx.textAlign = 'start';
          //ctx.fillText($scope.txtDoc.content[num-1], lnX, lnY);
          
          // wraps text on new line
          var text = $scope.txtDoc.content[num-1];
          var lines = text.split("\n");
          console.log(lines)
          var str, wordWidth, words, index, currentLine = 0;

          var printNextLine = function(str) {
            ctx.fillText(str, lnX, lnY + (lnH * currentLine));
            currentLine++;
          };
          
          for (var i = 0; i < lines.length; i++) {
            words = lines[i].split(' ');
            index = 1;

            while (words.length > 0 && index <= words.length) {

              str = words.slice(0, index).join(' ');
              wordWidth = ctx.measureText(str).width;

              if (wordWidth > fitWidth) {
                if (index === 1) {
                  // Falls to this case if the first word in words[] is bigger than fitWidth
                  // so we print this word on its own line; index = 2 because slice is
                  str = words.slice(0, 1).join(' ');
                  words = words.splice(1);
                } else {
                  str = words.slice(0, index - 1).join(' ');
                  words = words.splice(index - 1);
                }

                printNextLine(str);

                index = 1;
              } else {
                index++;
              }
            }

            // The left over words on the last line
            if (index > 0) {
              printNextLine(words.join(' '));
            }
          }
          
          $scope.onPageLoad({ page: $scope.pageNum, total: $scope.txtDoc.totalPages });
        };

        $scope.$on('txtviewer.nextPage', function(evt, id) {
          if (id !== instanceId) {
            return;
          }

          if ($scope.pageNum < $scope.txtDoc.totalPages) {
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

          if (page >= 1 && page <= $scope.txtDoc.totalPages) {
            $scope.pageNum = page;
            $scope.renderPage($scope.pageNum);
          }
        });

        $scope.$on('txtviewer.zoomIn', function() {
          if ($scope.scale < SCALE.MAX_SCALE) {
            $scope.scale += SCALE.SCALE_STEP;
            $scope.renderPage($scope.pageNum);
          }
        });

        $scope.$on('txtviewer.zoomOut', function() {
          if ($scope.scale > SCALE.MIN_SCALE) {
            $scope.scale -= SCALE.SCALE_STEP;
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
