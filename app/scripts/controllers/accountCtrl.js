'use strict';

readingRoomApp.controller('AccountController',
  function accountController($scope, $modal, $log, accountService){

    $scope.user = {};
    $scope.user.firstName = 'Log in';

    /////////////////////////////////////
    //
    //   Log in dialog
    //
    /////////////////////////////////////
    $scope.openLoginDlg = function () {

      var modalInstance = $modal.open({
        templateUrl: 'myLogin',
        controller: ModalLoginCtrl,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (p) {
        accountService.login(p.userName, p.password)
          .then(function(data){
            $scope.user = data.user;
          }, function(status){
            $log.info(status);
          });
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    var ModalLoginCtrl = function ($scope, $modalInstance) {
      $scope.ok = function (res1, res2) {
        if($("#login-form").validateAccount() ){
          $modalInstance.close({userName:res1, password: res2});
        }
      };

      $scope.cancel = function () {
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
        controller: ModalRegisterCtrl,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (p) {
        accountService.register(p.userName, p.password)
          .then(function(data){
            $scope.user = data.user;
          }, function(status){
            $log.info(status);
          });
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    var ModalRegisterCtrl = function ($scope, $modalInstance, CountriesList) {
      $scope.countries = CountriesList.countries;
      $scope.country = "Israel";

      $scope.ok_r = function (res1, res2) {
        if($("#register-form").validateAccount() ){
          $modalInstance.close({userName:res1, password: res2});
        }
      };

      $scope.cancel_r = function () {
        $modalInstance.dismiss('cancel');
      };
    };
  }
);

