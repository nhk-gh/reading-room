'use strict';

angular.module('readingRoomApp')
  .controller('BookCtrl',
    ['$scope', '$rootScope', '$window', '$log', '$routeParams', 'BookSrvc',
      'userSrvc', 'PDFViewerService', 'TextViewerSrvc',
    function ($scope, $rootScope, $window, $log, $routeParams, BookSrvc,
              userSrvc, PDFViewerService, TextViewerSrvc) {

    //////////////////////////////////////////////////

   // $scope.vwer = PDFViewerService.Instance('viewer');

    $scope.nextPage = function() {
      if ($scope.vwer) {
        $scope.vwer.nextPage();
      }
    };

    $scope.prevPage = function() {
      if ($scope.vwer) {
        $scope.vwer.prevPage();
      }
    };

    $scope.gotoPage = function(pgNum) {
      if ($scope.vwer) {
        $scope.vwer.gotoPage(pgNum);
      }
    };

    $scope.zoomIn = function() {
      if ($scope.vwer) {
        $scope.vwer.zoomIn();
      }
    };

    $scope.zoomOut = function() {
      if ($scope.vwer) {
        $scope.vwer.zoomOut();
      }
    };

    $scope.pageLoaded = function(curPage, totalPages) {
      $scope.currentPage = curPage;
      $scope.totalPages = totalPages;

      BookSrvc.setCurrentBook(
          userSrvc.getUser()._id,            // current user id
          $scope.currentBook.ind,            // current book id
          $scope.currentBook.currentChapter, // current page before (user begin/continue reading the book)
          $scope.currentPage,                // current page after (user stop/finish reading the book)
          false)                             // true - reset currenאBook field (0), flase set it equal to bookInd value
        .then(function(){
          for (var i=0; i < userSrvc.user.bookshelf.length; i++) {
            if (userSrvc.user.bookshelf[i].ind === $scope.currentBook.ind) {
              $scope.currentBook.currentChapter = $scope.currentPage;
              userSrvc.user.bookshelf[i].currentChapter = $scope.currentPage;

              if ($scope.currentBook.type === 'application/pdf') {
                $scope.vwer = PDFViewerService.Instance('viewer');
              } else {
                $scope.vwer = TextViewerSrvc.Instance('txt-viewer');
              }
              break;
            }
          }

        },
        function(){

      });
    };

    $scope.$watch('currentPage', function(newValue, oldValue){
      //$log.info(typeof newValue, oldValue)
      if ((newValue !== oldValue) && !isNaN(newValue)) {
        $scope.gotoPage(parseInt(newValue));
      }
    });

    ///////////////////////////////////////////////////

    $scope.currentBook = {};

    $scope.getBookContent = function(){
      $scope.pageNum = $routeParams.chapter;

      BookSrvc.getBook($routeParams.ind)
        .then(function(data){
          $scope.currentBook = data.book;
          var ar = $scope.currentBook.path.split('/');
          $scope.currentBook.link = ar[ar.length -2] + '/' + ar[ar.length -1];

        }, function(){

      });
    };
    /*
    $rootScope.$on('$locationChangeStart', function(event) {
      BookSrvc.setCurrentBook(
          userSrvc.getUser()._id,            // current user id
          $scope.currentBook.ind,            // current book id
          $scope.currentBook.currentChapter, // current page before (user begin/continue reading the book)
          $scope.currentPage,                // current page after (user stop/finish reading the book)
          false)                             // true - reset currenאBook field (0), flase set it equal to bookInd value
        .then(function(data){
          for (var i=0; i < userSrvc.user.bookshelf.length; i++) {
            if (userSrvc.user.bookshelf[i].ind === $scope.currentBook.ind) {
              $scope.currentBook.currentChapter = $scope.currentPage;
              userSrvc.user.bookshelf[i].currentChapter = $scope.currentPage;
              break;
            }
          }

        }
        ,function(err){

        });
    });
    */
    /*
    $window.onbeforeunload = function(event) {
      //return('beforeunload');

      BookSrvc.setCurrentBook(
          userSrvc.getUser()._id,            // current user id
          $scope.currentBook.ind,            // current book id
          $scope.currentBook.currentChapter, // current page before (user begin/continue reading the book)
          $scope.currentPage,                // current page after (user stop/finish reading the book)
          false)                             // true - reset currenאBook field (0), flase set it equal to bookInd value
        .then(function(data){
          for (var i=0; i < userSrvc.user.bookshelf.length; i++) {
            if (userSrvc.user.bookshelf[i].ind === $scope.currentBook.ind) {
              $scope.currentBook.currentChapter = $scope.currentPage;
              userSrvc.user.bookshelf[i].currentChapter = $scope.currentPage;
              break;
            }
          }

        }
        ,function(err){

        });
    };
 */
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
