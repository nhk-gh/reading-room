'use strict';

describe('Service: Bookshelfsrvc', function () {

  // load the service's module
  beforeEach(module('readingRoomApp'));

  // instantiate service
  var Bookshelfsrvc;
  beforeEach(inject(function (_Bookshelfsrvc_) {
    Bookshelfsrvc = _Bookshelfsrvc_;
  }));

  it('should do something', function () {
    expect(!!Bookshelfsrvc).toBe(true);
  });

});
