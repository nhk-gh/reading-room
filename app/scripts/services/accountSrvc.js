'use strict';

angular.module('readingRoomApp').factory('accountService', function($q, $http, $log){
  return {
    login: function(user, password){
      var deferred = $q.defer();

      $log.info(user + ", "+ password);

      $http({method:'POST', url:'/login', data:{username: user, password: password}, cache: false})
        .success(function(data){
          $log.info(data);
          deferred.resolve(data);
        })
        .error(function(data, status){
          $log.warn('logIn error: ' + status);
          deferred.reject(status);
        });

      return deferred.promise;
    },

    getCountriesList: function(){
      var deferred = $q.defer();

      $http({method:'GET', url:'/countrieslist', cache: false})
        .success(function(data){
          deferred.resolve(data);
        })
        .error(function(data, status){
          $log.warn('getCountriesList error: ' + status);
          deferred.reject(status);
        });

      return deferred.promise;
    },

    register: function(user){
      var deferred = $q.defer();

      $http({method:'POST', url:'/register',
        data:{  // for compatability with prev. version:
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          password: user.password,
          country: user.country,
          email: user.email
        }, cache: false})
        .success(function(data){
          deferred.resolve(data);
        })
        .error(function(data, status){
          $log.warn('register error: ' + status);
          deferred.reject(status);
        });

      return deferred.promise;
    },

    editProfile: function(user){
      var deferred = $q.defer();

      $http({method:'POST', url:'/editprofile', data: user, cache: false})
        .success(function(data){
          deferred.resolve(data);
        })
        .error(function(data, status){
          $log.warn('editProfile error: ' + status);
          deferred.reject(status);
        });

      return deferred.promise;
    },

    logOut: function(user){
      var deferred = $q.defer();

      $http({method:'POST', url:'/logout', data:{username: user}, cache: false})
        .success(function(data){
          deferred.resolve(data);
        })
        .error(function(data, status){
          $log.warn('logOut error: ' + status);
          deferred.reject(status);
        });

      return deferred.promise;
    },

    passReminder: function(params){
      var deferred = $q.defer();

      $http({method:'POST', url:'/passwordreminder', data:params, cache: false})
        .success(function(data){
          deferred.resolve(data);
        })
        .error(function(data, status){
          $log.warn('passReminder error: ' + status);
          deferred.reject(status);
        });

      return deferred.promise;
    }
  };
});
