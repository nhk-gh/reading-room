'use strict';

angular.module('readingRoomApp')
  .controller('BookCtrl', function ($scope, $log, $routeParams) {
    $scope.title = $routeParams.title;
    $log.info($routeParams);
  });
