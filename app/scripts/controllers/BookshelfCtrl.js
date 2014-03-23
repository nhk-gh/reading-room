'use strict';

angular.module('readingRoomApp').controller('BookshelfCtrl', function ($scope, userSrvc, BookSrvc, BookshelfSrvc) {

  $scope.reader = userSrvc.getUser();
  $scope.errorMsg = null; // upload file error message

  $scope.$on('ERROR-MSG', function(evt, msg) {
    $scope.$apply(function(){
      $scope.errorMsg = msg;
    });

  });

  $scope.deleteBook = function(book){
    BookshelfSrvc.deleteBook(book)
      .then(function(data) {
        userSrvc.user = data;
        $scope.reader = userSrvc.getUser();
      },
      function() {

    });
  };

  BookSrvc.setCurrentBook(
      userSrvc.getUser()._id, // current user id
      null,                   // current book id
      null,                   // current page before (user begin/continue reading the book)
      null,                   // current page after (user stop/finish reading the book)
      true)                   // true - reset currenBook field (0), flase set it equal to bookInd value
    .then(function() {

  },
  function(){

  });

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
