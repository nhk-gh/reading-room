'use strict';

angular.module('readingRoomApp')
  .filter('searchReview', function () {
    return function (review, criteria) {

      if (review) {
        if (criteria === undefined) {
          return review;
        } else {
          var s;

          return review.filter(function(item) {
            s = (item.author + ' ' + item.book).toLowerCase().trim();
            return s.indexOf(criteria.toLowerCase()) > -1;
          });
        }
      }
    };
  });
