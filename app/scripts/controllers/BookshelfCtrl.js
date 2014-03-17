'use strict';

readingRoomApp.controller('BookshelfCtrl', function ($scope, $log, userSrvc,BookshelfSrvc) {

  $scope.reader = userSrvc.getUser();
  $scope.errorMsg = null; // upload file error message


  $scope.deleteBook = function(book){
    BookshelfSrvc.deleteBook(book)
      .then(function(data){
        userSrvc.user = data;
        $scope.reader = userSrvc.getUser();
      }
      ,function(err){

      });
  };


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
