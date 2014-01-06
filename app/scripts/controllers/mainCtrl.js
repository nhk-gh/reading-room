'use strict';

angular.module('readingRoomApp').controller('MainCtrl', function ($scope, $modal, $log) {


});


/*
angular.module('readingRoomApp').controller('SubmitLoginController',
  function($scope, $log, dialog, accountService ){

    $scope.close = function(userName, password){

      if ((userName === null) && (password === null)) {
        dialog.close(null);
      }
      else {
        if($('#login_form').find('form').validateAccount() ){
          accountService.logIn(userName, password)
            .then(function(data){
              if (data.error === 200) {
                dialog.close(data.user);
              }
              else{
                $log.error(data.message);
              }
            }, function(status){
              $log.error(status);
            });
        }
      }
    };
  });

 */