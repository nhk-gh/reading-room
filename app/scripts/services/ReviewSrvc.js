'use strict';

angular.module('readingRoomApp')
  .factory('ReviewSrvc', function ReviewSrvc($http, $q, $log) {
    return {
      getAll: function(){
        var deferred = $q.defer();

        $http({method:'GET', url:'/review', cache: false})
          .success(function(data){
            deferred.resolve(data);
          })
          .error(function(data, status){
            $log.error('Get all reviews error: ' + status);
            deferred.reject(status);
          });

        return deferred.promise;
      },

      saveReview: function(review){
        var deferred = $q.defer();

        $http({method:'POST', url:'/review', data:{ review: review }, cache: false})
          .success(function(data){
            deferred.resolve(data);
          })
          .error(function(data, status){
            console.log(data, status);
            deferred.reject(data);
          });

        return deferred.promise;
      }
    }
  });
