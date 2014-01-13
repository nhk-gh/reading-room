'use strict';

readingRoomApp.factory('userSrvc', function userSrvc() {
  return {
    user:{
      password: "",
      userName: "",
      logged: false,
      firstName: "",
      lastName: "",
      fullName: "",
      country: "",
      email: "",
      remember: false
    },

    getUser: function(){
      return this.user;
    },

    clearUser: function(){
      this.user = {
        password: "",
        userName: "",
        logged: false,
        firstName: "",
        lastName: "",
        fullName: "",
        country: "",
        email: "",
        remember: false
      }
    }
  }
});
