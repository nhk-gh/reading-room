'use strict';

angular.module('readingRoomApp')
  .controller('BookCtrl', [ '$scope', '$log', '$routeParams', 'BookSrvc','PDFViewerService',
    function ($scope, $log, $routeParams, BookSrvc, pdf) {

    //////////////////////////////////////////////////

    $scope.viewer = pdf.Instance("viewer");

    $scope.nextPage = function() {
      $scope.viewer.nextPage();
    };

    $scope.prevPage = function() {
      $scope.viewer.prevPage();
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
          $log.info($scope.currentBook.link)
          $log.info(data.book);
        }, function(status){

        });

    }
  }]);
