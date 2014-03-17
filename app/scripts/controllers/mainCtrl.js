'use strict';

angular.module('readingRoomApp').controller('MainCtrl',
  function ($scope, $rootScope, $log, accountService, userSrvc) {

    $scope.readLoginCookie = function(){
      var cook =  $.cookie('rem'); // last user e-mail and password

      if ( (cook !== undefined) && (cook !== {}) ) {
        var lastUser = JSON.parse(cook);

        accountService.login(lastUser.e, lastUser.p, true)
          .then(function(data){
            if (data.error === 200) {
              userSrvc.user = data.user;
              userSrvc.user.remember = true;
              $rootScope.$broadcast('logged-in');

            } else {
              alert(data.message);
            }

          }, function(status){
            $log.warn('Wrong cookie ??? (' + status +')');
            userSrvc.clearUser();
          });
      }
    };

    $scope.readLoginCookie();
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