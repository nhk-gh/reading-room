'use strict';


angular.module('readingRoomApp').factory('userSrvc', function userSrvc() {
  return {
    user:{
      password: '',
      userName: '',
      logged: false,
      firstName: '',
      lastName: '',
      fullName: '',
      country: '',
      email: '',
      remember: false,

      currentBook: '0',
      bookshelf:[]
    },

    getUser: function(){
      return this.user;
    },

    clearUser: function(){
      this.user = {
        password: '',
        userName: '',
        logged: false,
        firstName: '',
        lastName: '',
        fullName: '',
        country: '',
        email: '',
        remember: false,
        currentBook: 1,
        bookshelf:[]
      };
    },

    addBook: function(){
      var book = {};

      this.user.bookshelf.push(book);
    }
  };
});
