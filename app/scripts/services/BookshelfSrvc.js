'use strict';

angular.module('readingRoomApp')
  .factory('BookshelfSrvc', function BookshelfSrvc($q, $http, $log) {
    return {
      deleteBook: function(book) {
        var deferred = $q.defer();
        $log.warn(book);
        $http({ method:'DELETE', url:'/book/' + book.title, cache: false })
          .success(function(data){
            deferred.resolve(data);
            $log.warn(data);
          })
          .error(function(data, status){
            $log.warn('Delete book error: ' + status);
            deferred.reject(status);
          });

        return deferred.promise;
      }

    };
  });
