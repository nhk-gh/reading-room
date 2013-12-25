'use strict';

angular.module('readingRoomApp')
    .service('MySrvc', function MySrvc($http, $q, $log) {
        return {
          getAwesomeThings: function(){
            var deferred = $q.defer();

            $http({method:'GET', url:'/awesomeThings'})
              .success(function(data){
                deferred.resolve(data);
              })
              .error(function(data, status){
                $log.warn(' "/awesomeThings" error: ' + status);
                deferred.reject(status);
              });

            return deferred.promise;
          }
        };
      });
