'use strict';

angular.module('readingRoomApp')
  .directive('addReview', function ($log, userSrvc, ReviewSrvc) {
    return {
      templateUrl: 'views/newreview.html',
      restrict: 'E',
      replace: true,

      link: function (scope) {
        scope.newReview = {};
        scope.addReviewVisible = false;
        scope.newRevewErrorMsg = null;
        scope.disableSaveBtn = true;

        scope.enableAddBtn = function() {
          $log.info('newReview.book: ' + scope.newReview.book);
          $log.info('newReview.author: ' + scope.newReview.author);
          $log.info('newReview.review: ' + scope.newReview.review);
          $log.info('newReview.reviewer: ' + scope.newReview.reviewer);
          scope.disableSaveBtn = (scope.newReview.reviewer.trim() === '') || (scope.newReview.book.trim() === '') ||
            (scope.newReview.author.trim() === '') || (scope.newReview.review.trim() === '');
        };
        /*
        var inp_fld = element.find('.input-fld');
        inp_fld.bind('keypress', function(event){
          scope.$apply(function(){

            $log.info(event);
            $log.info('newReview.book: ' + scope.newReview.book);
            $log.info('newReview.author: ' + scope.newReview.author);
            $log.info('newReview.review: ' + scope.newReview.review);
            $log.info('newReview.reviewer: ' + scope.newReview.reviewer);

            scope.disableSaveBtn = (scope.newReview.reviewer.trim() === '') || (scope.newReview.book.trim() === '') ||
              (scope.newReview.author.trim() === '') || (scope.newReview.review.trim() === '');
          });
        });
        */
        scope.toggleAddReviewDlg = function() {
          if (!scope.addReviewVisible) {
            scope.newReview.reviewer = userSrvc.user.fullName;
            scope.newReview.book = '';   // book title
            scope.newReview.author = ''; // book author
            scope.newReview.review = ''; // review itself
          }

          scope.addReviewVisible = !scope.addReviewVisible;
          if (scope.addReviewVisible === false) {
            scope.disableSaveBtn = true;
          }
        };

        scope.saveReview = function() {
          ReviewSrvc.saveReview(scope.newReview)
            .then(function(data) {
              scope.reviews.unshift(data.newReview);
              scope.addReviewVisible = false;
              scope.newRevewErrorMsg = null;
              scope.disableSaveBtn = true;
            },
            function(data){
              $log.error('saveReview error: ' + data);
              scope.newRevewErrorMsg =  data;
            }
          );
        };
      }
    };
  });
