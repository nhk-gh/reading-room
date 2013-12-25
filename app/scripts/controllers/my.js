'use strict';

angular.module('readingRoomApp')
  .controller('MyCtrl', function ($scope, MySrvc) {
    $scope.awesomeThings = [
      'Naum',
      'Irena'
    ];

    $scope.getAwesomeThings = function(){
      MySrvc.getAwesomeThings()
        .then(
          function(data){
            $scope.awesomeThings = data;
          },
          function(err){
            console.log(err);
          }
      );
    };
  });
