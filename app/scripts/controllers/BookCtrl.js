'use strict';

angular.module('readingRoomApp')
  .controller('BookCtrl', [ '$scope', '$log', '$routeParams', 'BookSrvc','PDFViewerService',
    function ($scope, $log, $routeParams, BookSrvc, PDFViewerService) {

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
    };

    ///////////////////////////////////////////////////

    $scope.currentBook = {};

    $scope.getBookContent = function(){
      BookSrvc.getBook($routeParams.title)
        .then(function(data){
          $scope.currentBook = data.book;
          var ar = $scope.currentBook.path.split('/');
          $scope.currentBook.link = ar[ar.length -2] + '/' + ar[ar.length -1];
          //$log.info($scope.currentBook.link)
          //$log.info(data.book);


          //var myPDF = new PDFObject({ url: $scope.currentBook.link }).embed('pdf-content');
          //$log.info(myPDF);

        }, function(status){

        });

    };

  }]);
