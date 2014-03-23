'use strict';

angular.module('readingRoomApp')
  .factory('BookSrvc', function BookSrvc($http, $q, $log) {
    return {
      getBook: function(title) {
        var deferred = $q.defer();

        $http({method:'GET', url:'/book/' + title})
          .success(function(data){
            deferred.resolve(data);
          })
          .error(function(data, status){
            $log.warn('Log in error: ' + status);
            deferred.reject(status);
          });

        return deferred.promise;
      },

      setCurrentBook: function(userID, bookInd, oldPage, newPage, reset) {
        // resets current book and set current page
        var deferred = $q.defer();

        $http({ method:'PUT', url:'/reader/'+userID+'/'+bookInd+'/'+oldPage+'/'+newPage, params:{reset:reset}, cache: false })
          .success(function(data) {
            deferred.resolve(data);
          })
          .error(function(data, status) {
            $log.warn('resetCurrentBook book error: ' + status);
            deferred.reject(status);
          });

        return deferred.promise;
      }
    };
  });
