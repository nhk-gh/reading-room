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
      remember: false,

      currentBook: 1,
      bookshelf:[]
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
        remember: false,
        currentBook: 1,
        bookshelf:[]
      }
    },

    addBook: function(file){
      var book = {};

      this.user.bookshelf.push(book);
    }
  }
});
