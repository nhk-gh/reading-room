'use strict';

angular.module('readingRoomApp').controller('AccountController',
  function accountController($scope, $rootScope, $modal, $location, $log, accountService, userSrvc){
    //$.removeCookie('rem');
    $scope.$on('logged-in', function(){
      for (var b=0; b<userSrvc.user.bookshelf.length; b++) {
        userSrvc.user.bookshelf[b].icon = userSrvc.user.bookshelf[b].icon || 'images/book-icon.png';
      }
      $scope.user = userSrvc.user;

      if (parseInt($scope.user.currentBook, 16) !== 0)  {
        var page;
        for (var i=0; i < $scope.user.bookshelf.length; i++) {
          if ($scope.user.bookshelf[i].ind === $scope.user.currentBook) {
            page = $scope.user.bookshelf[i].currentChapter > 0 ? $scope.user.bookshelf[i].currentChapter : 1;
            //break;
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

    var ModalLogoutCtrl = ['$scope', '$modalInstance', function ($scope, $modalInstance) {
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
    }];

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

    var ModalLoginCtrl = ['$scope', '$modalInstance', function ($scope, $modalInstance) {
      $scope.loginErr = '';
      $scope.loginInfo = '';

      $scope.$on('password-sent', function(){
        $scope.loginInfo = 'Password was send to your e-mail address';
      });

      $scope.ok = function (res1, res2, res3) {
        var err = $('#login-form').validateAccount();
        if(err === '' ){
          accountService.login(res1, res2)
            .then(function(data) {
              if (data.error === 200) {
                data.user.remember = res3;
                $modalInstance.close(data.user);
              } else {
                $log.error(data.message);
                $scope.loginErr = data.message;
                $scope.loginInfo = '';
              }
            }, function(status){
              $log.error(status);
              $scope.loginErr = status;
              $scope.loginInfo = '';
            });
        } else {
          $scope.loginErr = err;
          $scope.loginInfo = '';
          $log.error(err);
        }
      };
      /*
      $scope.loginGoogle = function () {
        accountService.loginGoogle()
          .then(function(data) {
            if (data.error === 200) {
              data.user.remember = res3;
              $modalInstance.close(data.user);
            } else {
              $log.error(data.message);
              $scope.loginErr = data.message;
              $scope.loginInfo = '';
            }
          }, function(status){
            $log.error('google error ' + status);
            $scope.loginErr = status;
            $scope.loginInfo = '';
          });
      };

      $scope.loginFacebook = function (res1, res2, res3) {
        accountService.loginFacebook()
          .then(function(data) {
            if (data.error === 200) {
              data.user.remember = res3;
              $modalInstance.close(data.user);
            } else {
              $log.error(data.message);
              $scope.loginErr = data.message;
              $scope.loginInfo = '';
            }
          }, function(status){
            $log.error('fb error '+status);
            $scope.loginErr = status;
            $scope.loginInfo = '';
          });
      };
      */
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

      $scope.passwordReminder = function(){
        $rootScope.$broadcast('reminder');
      };
    }];

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
        } */
      });

      modalInstance.result.then(function (p) {
        userSrvc.user = p;
        $scope.user = userSrvc.user;
        $rootScope.$broadcast('password-sent');
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
        userSrvc.clearUser();
      });
    };

    var ModalReminderCtrl = ['$scope', '$modalInstance', 'countriesSrvc', 'userSrvc',
                              function ($scope, $modalInstance, countriesSrvc, userSrvc/*, lf*/) {
      $scope.countries = countriesSrvc.countries;
      $scope.user = userSrvc.user;
      $scope.remErr = '';
      $scope.remInfo = '';

      $scope.okRem = function (email, look, name) {
        var err = $('#reminder-form').validateAccount();
        if(err === '' ){
          $scope.remInfo = 'Sending password to your e-mail ...';

          accountService.passwordReminder({email:email, lookfor: look, name: name})
            .then(function(data){
              if (data.error === 200) {
                $log.warn(data.message);
                $modalInstance.close(data.user);
              } else {
                $log.warn(data.message);
                $scope.remErr = data.message;
                $scope.remInfo = '';
              }
            }, function(status){
              $log.warn(status);
              $scope.remErr = status;
              $scope.remInfo = '';
            });
        } else {
          $scope.remErr = err;
          $scope.remInfo = '';
          $log.warn(err);
        }
      };

      $scope.cancelRem = function () {
        $modalInstance.dismiss('cancel');
      };
    }];

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

    var ModalRegisterCtrl = ['$scope', '$modalInstance', 'countriesSrvc', 'userSrvc', function ($scope, $modalInstance, countriesSrvc, userSrvc) {
      $scope.countries = countriesSrvc.countries;
      $scope.user = userSrvc.user;
      $scope.regErr = '';

      $scope.okReg = function () {
        var err = $('#register-form').validateAccount();
        if(err === '' ){
          accountService.register($scope.user)
            .then(function(data){
              if (data.error === 200) {
                $modalInstance.close(data.user);
              } else {
                $log.warn(data.message);
                $scope.regErr = data.message;
              }
            }, function(status){
              $log.warn(status);
              $scope.regErr = status;
            });
        } else {
          $scope.regErr = err;
          $log.warn(err);
        }
      };

      $scope.cancelReg = function () {
        $modalInstance.dismiss('cancel');
      };
    }];
  }
);

