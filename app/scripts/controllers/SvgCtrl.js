'use strict';

angular.module('readingRoomApp')
  .controller('SvgCtrl', function ($scope, $log) {

    $scope.rects = [];

    $scope.Init = function() {
      var left = 20;
      var top = 30;
      var width = 100;
      var height = 120;
      var w_gap = 50;

      for (var i=0; i<5; i++) {
        var r = {};
        r.x = left + i * (width + w_gap);
        r.y = top;
        r.w = width;
        r.h = height;
        r.link = '#'+i;

        $scope.rects.push(r);
        $scope.top_zone = 15;
      }

      $scope.rects[0].tags = ['apple','peach','plum'];
      $scope.rects[1].tags = ['apple'];
      $scope.rects[2].tags = ['carrot','onion'];
      $scope.rects[3].tags = ['peach','plum'];
    }
  });
