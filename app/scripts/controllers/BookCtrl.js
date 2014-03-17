'use strict';

angular.module('readingRoomApp')
  .controller('BookCtrl', [ '$scope', '$rootScope', '$window', '$log', '$routeParams', 'BookSrvc', 'userSrvc', 'PDFViewerService',
    function ($scope, $rootScope, $window, $log, $routeParams, BookSrvc, userSrvc, PDFViewerService) {

    //////////////////////////////////////////////////

    $scope.vwer = PDFViewerService.Instance("viewer");

    $scope.nextPage = function() {
      $scope.vwer.nextPage();
    };

    $scope.prevPage = function() {
      $scope.vwer.prevPage();
    };

     $scope.gotoPage = function(pgNum) {
      $scope.vwer.gotoPage(pgNum);
    };

    $scope.zoomIn = function() {
      $scope.vwer.zoomIn();
    };

    $scope.zoomOut = function() {
      $scope.vwer.zoomOut();
    };

    $scope.pageLoaded = function(curPage, totalPages) {
      $scope.currentPage = curPage;
      $scope.totalPages = totalPages;

//      $.cookie('lastbook', JSON.stringify({ind: $scope.currentBook.ind, chapter: $scope.currentPage}, {expires: 31, path: '/'}));
    };

    ///////////////////////////////////////////////////

    $scope.currentBook = {};

    $scope.getBookContent = function(){
      $scope.pageNum = $routeParams.chapter;

      BookSrvc.getBook($routeParams.ind)
        .then(function(data){
          $scope.currentBook = data.book;
          var ar = $scope.currentBook.path.split('/');
          $scope.currentBook.link = ar[ar.length -2] + '/' + ar[ar.length -1];

        }, function(status){

        });
    };

    $rootScope.$on('$locationChangeStart', function(event) {
      //alert($scope.currentPage);
      BookSrvc.resetCurrentBook(
          userSrvc.getUser()._id,            // current user id
          $scope.currentBook.ind,            // current book id
          $scope.currentBook.currentChapter, // current page before (user begin/continue reading the book)
          $scope.currentPage)                // current page after (user stop/finish reading the book)
        .then(function(data){
          //$scope.currentBook.currentChapter = $scope.currentPage;

          for (var i=0; i < userSrvc.user.bookshelf.length; i++) {
            if (userSrvc.user.bookshelf[i].ind === $scope.currentBook.ind) {
              userSrvc.user.bookshelf[i].currentChapter = $scope.currentPage;
              break;
            }
          }

        }
        ,function(err){

        });
    });

    $window.onbeforeunload = function(event) {
      //return('beforeunload');

      BookSrvc.resetCurrentBook(
          userSrvc.getUser()._id,            // current user id
          $scope.currentBook.ind,            // current book id
          $scope.currentBook.currentChapter, // current page before (user begin/continue reading the book)
          $scope.currentPage)                // current page after (user stop/finish reading the book)
        .then(function(data){
          //$scope.currentBook.currentChapter = $scope.currentPage;

          for (var i=0; i < userSrvc.user.bookshelf.length; i++) {
            if (userSrvc.user.bookshelf[i].ind === $scope.currentBook.ind) {
              userSrvc.user.bookshelf[i].currentChapter = $scope.currentPage;
              break;
            }
          }

        }
        ,function(err){

        });
    };
      /*
      var leavingPageText = "You'll lose your changes if you leave";
      window.onbeforeunload = function(){
        return leavingPageText;
      }

      $scope.$on('$locationChangeStart', function(event, next, current) {
        if(!confirm(leavingPageText + "\n\nAre you sure you want to leave this page?")) {
          event.preventDefault();
        }
      });
      */
}]);
