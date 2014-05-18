'use strict';

describe('Service: Book', function () {

  // load the service's module
  beforeEach(module('readingRoomApp'));

  // instantiate service
  var Book;
  beforeEach(inject(function (_BookSrvc_) {
    Book = _BookSrvc_;
  }));

  it('should do something', function () {
    expect(!!Book).toBe(true);
  });

});
