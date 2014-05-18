'use strict';

describe('Service: Bookshelfsrvc', function () {

  // load the service's module
  beforeEach(module('readingRoomApp'));

  // instantiate service
  var Bookshelfsrvc;
  beforeEach(inject(function (BookshelfSrvc) {
    Bookshelfsrvc = BookshelfSrvc;
  }));

  it('should do something', function () {
    expect(!!Bookshelfsrvc).toBe(true);
  });

});
