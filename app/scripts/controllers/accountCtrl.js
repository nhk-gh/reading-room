'use strict';

angular.module('readingRoomApp').controller('AccountController',
  function accountController($scope, $rootScope, $modal, $location, $log, accountService, userSrvc){

    $scope.$on('logged-in', function(){
      $scope.user = userSrvc.user;

      if (parseInt($scope.user.currentBook,16) !== 0)  {
        var page;
        for (var i=0; i < $scope.user.bookshelf.length; i++) {
          if ($scope.user.bookshelf[i].ind === $scope.user.currentBook) {
            page = $scope.user.bookshelf[i].currentChapter > 0 ? $scope.user.bookshelf[i].currentChapter : 1;
            break;
          }
        }
        $location.path('/book/' + $scope.user.currentBook + '/' + page);

      } else {
        $location.path('/bookshelf');
      }

      if ($scope.user.remember === true) {
        $.cookie('rem', JSON.stringify({e: $scope.user.email, p: $scope.user.password}, {expires: 31, path: '/'}));
      }
      else {
        $.removeCookie('rem');
      }
    });

    /////////////////////////////////////
    //
    //   Log out dialog
    //
    /////////////////////////////////////
    $scope.openLogoutDlg = function () {

      var modalInstance = $modal.open({
        templateUrl: 'myLogout',
        controller: ModalLogoutCtrl/*,
         resolve: {
         items: function () {
         return $scope.items;
         }
         } */
      });

      modalInstance.result.then(function () {
        userSrvc.clearUser();
        $scope.user = userSrvc.user;
        $.removeCookie('rem');
        $location.path('/');
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    var ModalLogoutCtrl = function ($scope, $modalInstance) {
      $scope.okOut = function () {
        accountService.logout(userSrvc.user.email)
          .then(function(data) {
            if (data.error === 200) {
              $modalInstance.close();
            } else {
              $log.warn(data.message);
            }
          }, function(status){
            $log.warn(status);
          });
      };

      $scope.cancelOut = function () {
        $modalInstance.dismiss('cancel');
      };
    };

    /////////////////////////////////////
    //
    //   Log in dialog
    //
    /////////////////////////////////////
    $scope.openLoginDlg = function () {

      var modalInstance = $modal.open({
        templateUrl: 'myLogin',
        controller: ModalLoginCtrl/*,
        resolve: {
          items: function () {
            return $scope.items;
          }
        } */
      });

      modalInstance.result.then(function (p) {
        userSrvc.user = angular.copy(p);
        $rootScope.$broadcast('logged-in');
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
        userSrvc.clearUser();
      });
      $scope.user = userSrvc.user;
    };

    var ModalLoginCtrl = function ($scope, $modalInstance) {
      $scope.ok = function (res1, res2, res3) {
        if($('#login-form').validateAccount() ){
          accountService.login(res1, res2)
            .then(function(data) {
              if (data.error === 200) {
                data.user.remember = res3;
                $modalInstance.close(data.user);
              } else {
                $log.warn(data.message);
              }
            }, function(status){
              $log.info(status);
              $log.warn(status);
            });
        }
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

      $scope.passwordReminder = function(){
        $rootScope.$broadcast('reminder');
      };
    };

    /////////////////////////////////////
    //
    //   Password reminder dialog
    //
    /////////////////////////////////////
    $scope.$on('reminder', function(){
      $scope.openReminderDlg();
    });
    $scope.openReminderDlg = function () {
//      $scope.lookfor1 = 'lll';

      var modalInstance = $modal.open({
        templateUrl: 'myReminder',
        controller: ModalReminderCtrl/*,
        resolve: {
          lf: function () {
            return $scope.lookfor;
          }
        }  */
      });

      modalInstance.result.then(function (p) {
        userSrvc.user = p;
        $scope.user = userSrvc.user;

      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
        userSrvc.clearUser();
      });
    };

    var ModalReminderCtrl = function ($scope, $modalInstance, countriesSrvc, userSrvc/*, lf*/) {
      $scope.countries = countriesSrvc.countries;
      $scope.user = userSrvc.user;

      $scope.okRem = function (email, look, name) {
        if($('#reminder-form').validateAccount() ){
          accountService.passwordReminder({email:email, lookfor: look, name: name})
            .then(function(data){
              if (data.error === 200) {
                $log.warn(data.message);
                $modalInstance.close(data.user);
              } else {
                $log.warn(data.message);
              }
            }, function(status){
              $log.warn(status);
              $log.warn(status);
            });
        }
      };

      $scope.cancelRem = function () {
        $modalInstance.dismiss('cancel');
      };
    };

    /////////////////////////////////////
    //
    //   Register dialog
    //
    /////////////////////////////////////
    $scope.openRegisterDlg = function () {

      var modalInstance = $modal.open({
        templateUrl: 'myRegister',
        controller: ModalRegisterCtrl/*,
        resolve: {
          items: function () {
            return $scope.items;
          }
        } */
      });

      modalInstance.result.then(function (p) {
        userSrvc.user = p;
        $scope.user = userSrvc.user;
        $rootScope.$broadcast('logged-in');
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
        userSrvc.clearUser();
      });
    };

    var ModalRegisterCtrl = function ($scope, $modalInstance, countriesSrvc, userSrvc) {
      $scope.countries = countriesSrvc.countries;
      $scope.user = userSrvc.user;

      $scope.okReg = function () {
        if($('#register-form').validateAccount() ){
          accountService.register($scope.user)
            .then(function(data){
              if (data.error === 200) {
                $modalInstance.close(data.user);
              } else {
                $log.warn(data.message);
              }
            }, function(status){
              $log.warn(status);
            });
        }
      };

      $scope.cancelReg = function () {
        $modalInstance.dismiss('cancel');
      };
    };
  }
);

