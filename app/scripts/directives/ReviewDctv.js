'use strict';

angular.module('readingRoomApp')
  .directive('review', function ($log, $timeout, $rootScope, $window, ReviewSrvc) {
    return {
      templateUrl: 'views/reviews.html',
      restrict: 'EA',
      replace: true,
      scope: {},

      link: function (scope, element) {
        scope.showReviews = false;

        function getAllReviews(){
          ReviewSrvc.getAll()
            .then(function(data) {
              scope.reviews = data.reviews;
              scope.reviews.allCollapsed = false;
              angular.forEach(scope.reviews, function(rev) {
                rev.itemCollapsed = false;
              });
              //$log.info(scope.reviews);
            },
            function(status){
              /*$scope.remErr = err;
              $scope.remInfo = '';  */
              $log.warn('getAllReviews error: ' + status);
            }
          );
        }

        scope.$on('show-reviews', function(){
          getAllReviews();
          scope.showReviews = true;
        });

        element.find('.review-close').on('click', function(){
          scope.$apply(function() {
            scope.showReviews = false;
          });
        });

        scope.collapse = function(ind, fromCollapseAll){
          var el = $('.review-item:nth-child('+ (ind+1) + ')'); // nth-child is 1-based
          el = el.find('.review-item-collapsable');

          if (!fromCollapseAll) {
            // item's expand/collapse button clicked !!!
            scope.reviews[ind].itemCollapsed = !scope.reviews[ind].itemCollapsed;

            // sets proper all expand/collapse button state (sign)
            var allExpanded = 0;
            angular.forEach(scope.reviews, function(rev) {
              if (!rev.itemCollapsed) {
                allExpanded++;
              }
            });
            switch (allExpanded) {
              case 0:  // all collapsed
                scope.reviews.allCollapsed = true;
                break;
              case scope.reviews.length: // all expanded
                scope.reviews.allCollapsed = false;
                break;
            }
          }

          if (scope.reviews[ind].itemCollapsed){
            el.fadeOut(500);
            /*el.addClass('review-collapse');
            el.removeClass('review-expand');*/
          } else {
            el.fadeIn(500);
             /*el.removeClass('review-collapse');
            el.addClass('review-expand');*/
          }
        };

        scope.collapseAll = function(){
          scope.reviews.allCollapsed = !scope.reviews.allCollapsed;

          angular.forEach(scope.reviews, function(rev, ind) {
            rev.itemCollapsed = scope.reviews.allCollapsed;
            scope.collapse(ind, true);
          });
        };

        angular.element($window).on('resize', function(){
          var h = element.find('.review-container').height();
          var timeline = element.find('.review-timeline');
          timeline.height(h-90);
        });

      }
    };
  });
