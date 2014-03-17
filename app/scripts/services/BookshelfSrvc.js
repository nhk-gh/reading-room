'use strict';

angular.module('readingRoomApp')
  .factory('BookshelfSrvc', function BookshelfSrvc($q, $http, $log) {
    return {
      deleteBook: function(ind) {
        var deferred = $q.defer();

        $http({ method:'DELETE', url:'/book/' + ind, cache: false })
          .success(function(data){
            deferred.resolve(data);
          })
          .error(function(data, status){
            $log.warn('Delete book error: ' + status);
            deferred.reject(status);
          });

        return deferred.promise;
      }
    };
  });
