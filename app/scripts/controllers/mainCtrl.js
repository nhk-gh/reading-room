'use strict';

angular.module('readingRoomApp').controller('MainCtrl',
  function ($scope, $rootScope, $log, accountService, userSrvc) {

    $scope.readLoginCookie = function() {
      var lastUser = {}, encrypted, remember;
      var cook =  $.cookie('rem'); // last user e-mail and password
      var pass =  $.cookie('fblogin'); //

      if ( (pass !== undefined)  ) {
        lastUser.e = JSON.parse(pass).profileUrl;
        lastUser.p = JSON.parse(pass).id;
        encrypted = false;
        remember = false;

        $.removeCookie('fblogin');
      } else {
        if ((cook !== undefined) && (cook !== {}) ) {
          lastUser = JSON.parse(cook);
          encrypted = true;
          remember = true;
        }
      }

      if (lastUser.e) {
        accountService.login(lastUser.e, lastUser.p, encrypted)
          .then(function(data){
            if (data.error === 200) {
              userSrvc.user = data.user;
              userSrvc.user.remember = remember;
              $rootScope.$broadcast('logged-in');

            } else {
              $log.error(data.message);
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