'use strict';

readingRoomApp.controller('BookshelfCtrl', function ($scope, $log, $modal, userSrvc) {

  $scope.reader = userSrvc.getUser();

  /////////////////////////////////////
  //
  //   Add Book dialog
  //
  /////////////////////////////////////
  /* $scope.$on('openAddBookDlg', function(event, filename){
    //$log.info(event);
    //$log.info(filename);
    $scope.openAddBookDlg(filename);
  });

  $scope.openAddBookDlg = function(filename){
    $scope.fileName = filename;

    var modalInstance = $modal.open({
      templateUrl: 'addBook',
      controller: ModalAddBookCtrl,
      resolve: {
        item: function () {
          return filename;
        }
      }
    });

    modalInstance.result.then(function () {
      $scope.$broadcast('closeAddBookDlg', 'process');
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
      $scope.$broadcast('closeAddBookDlg', 'dismiss');
    });
  };

  var ModalAddBookCtrl = function ($scope, $modalInstance, item) {
    $scope.fileName = item;

    $scope.ok = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  };*/
});
