'use strict';

angular.module('readingRoomApp')
  .factory('BookSrvc', function BookSrvc($http, $q, $log) {
    return {
      getBook: function(title){
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
      }
    };
  });
