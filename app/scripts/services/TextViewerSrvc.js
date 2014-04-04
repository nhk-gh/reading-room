'use strict';

angular.module('readingRoomApp')
  .service('TextViewerSrvc', function($q, $http, $rootScope, $log, $routeParams) {
    var svc = { };

    svc.getDocument = function(){
      var deferred = $q.defer();

      $http({method:'GET', url:'/book/' + $routeParams.ind})
        .success(function(data){
          deferred.resolve(data);
        })
        .error(function(data, status){
          $log.warn('Log in error: ' + status);
          deferred.reject(status);
        });

      return deferred.promise;
    };

    svc.Instance = function(id) {
      var instanceId = id;

      return {
        prevPage: function() {
          $rootScope.$broadcast('txtviewer.prevPage', instanceId);
        },

        nextPage: function() {
          $rootScope.$broadcast('txtviewer.nextPage', instanceId);
        },

        gotoPage: function(page) {
          $rootScope.$broadcast('txtviewer.gotoPage', instanceId, page);
        },

        zoomIn: function() {
          $rootScope.$broadcast('txtviewer.zoomIn');
        },

        zoomOut: function() {
          $rootScope.$broadcast('txtviewer.zoomOut');
        }
      };
    };
    return svc;
  });
