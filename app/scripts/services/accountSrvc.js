'use strict';

angular.module('readingRoomApp').factory('accountService', function($q, $http, $log){
  return {
    login: function(user, password, encrypted){
      var deferred = $q.defer();

      $http({method:'POST', url:'/login', data:{username: user, password: password, encrypted:encrypted }, cache: false})
        .success(function(data){
          deferred.resolve(data);
        })
        .error(function(data, status){
          $log.error('Local Log in error: ' + status);
          deferred.reject(status);
        });

      return deferred.promise;
    },
 /*
    loginFacebook : function(){
      var deferred = $q.defer();

      $http({method:'GET', url:'/login/fb'})
        .success(function(data){
          deferred.resolve(data);
          $log.error(data);
        })
        .error(function(data, status){
          $log.error('Facebook Log in error: ' + status);
          deferred.reject(status);
        });

      return deferred.promise;
    },

    loginGoogle: function(){
      var deferred = $q.defer();

      $http({method:'GET', url:'/login/google'})
        .success(function(data){
          deferred.resolve(data);
        })
        .error(function(data, status){
          $log.error('Google Log in error: ' + status);
          deferred.reject(status);
        });

      return deferred.promise;
    },
 */
    getCountriesList: function(){
      var deferred = $q.defer();

      $http({method:'GET', url:'/countrieslist', cache: false})
        .success(function(data){
          deferred.resolve(data);
        })
        .error(function(data, status){
          $log.error('getCountriesList error: ' + status);
          deferred.reject(status);
        });

      return deferred.promise;
    },

    register: function(user){
      var deferred = $q.defer();

      $http({method:'POST', url:'/register',
        data:{  // for compatability with prev. version:
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          password: user.password,
          country: user.country,
          email: user.email
        }, cache: false})
        .success(function(data){
          deferred.resolve(data);
        })
        .error(function(data, status){
          $log.error('register error: ' + status);
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
          $log.error('editProfile error: ' + status);
          deferred.reject(status);
        });

      return deferred.promise;
    },

    logout: function(user){
      var deferred = $q.defer();

      $http({method:'POST', url:'/logout', data:{username: user}, cache: false})
        .success(function(data){
          deferred.resolve(data);
        })
        .error(function(data, status){
          $log.error('logOut error: ' + status);
          deferred.reject(status);
        });

      return deferred.promise;
    },

    passwordReminder: function(params){
      var deferred = $q.defer();

      $http({method:'POST', url:'/passwordreminder', data:params, cache: false})
        .success(function(data){
          deferred.resolve(data);
        })
        .error(function(data, status){
          $log.error('passReminder error: ' + status);
          deferred.reject(status);
        });

      return deferred.promise;
    }
  };
});
