'use strict';

angular.module('readingRoomApp')
  .controller('BookshelfCtrl', function ($scope, userSrvc) {
    $scope.reader = userSrvc.getUser();
  });
